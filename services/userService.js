const sequelize = require("../postgre/db");
const initModels = require("../models/init-models");
const { Op } = require("sequelize");

const User = initModels(sequelize).user;
const Submission = initModels(sequelize).submission;
const Message = initModels(sequelize).message;
var CryptoJS = require("crypto-js");
var iv  = CryptoJS.enc.Utf8.parse('1583288699248111');

exports.list = async () => {
	try {
		return await User.findAll();
	} catch (err) {
		console.log(err);
	}
};

exports.getUserById = async (id) => {
	try {
		return await User.findByPk(id);
	} catch (err) {
		console.log(err);
	}
};

exports.getUsersByIds = async (ids) => {
	try {
		return await User.findAll({
			where: {
				userId: {
					[Op.in]: ids,
				},
			},
		});
	} catch (err) {
		console.log(err);
	}
};


exports.updateUser = async (userId,user) => {
	console.log(user)
	try {
		return await User.update(user, {
			where: {
				userId: userId,
			},
		});
	} catch (err) {
		console.log(err);
	}
};

exports.deleteUser = async (id) => {
	try {
		await Message.destroy({
			where: { [Op.or]: [{ sender_id: id }, { receiver_id: id }], }
		})
		let submissions = await Submission.findAll({
			where: { userId: id }
		})
		await Promise.all(submissions.map(async (sub) => {
			await deleteSubmissionById(sub.submissionId)
		}));
		return await User.destroy({
			where: {
				userId: id,
			},
		});
	} catch (err) {
		console.log(err);
	}
};
function decrypt(value) {
	try {
		  const decrypted = CryptoJS.AES.decrypt(value, process.env.JWT_SECRET);
		  if (decrypted) {
			  try {
				  const str = decrypted.toString(CryptoJS.enc.Utf8);
				  if (str.length > 0) {
					  return str
				  } else {
					  return 'error 1';
				  } 
			  } catch (e) {
				  return 'error 2';
			  }
		  }
		  return 'error 3';
	  } catch (err) {
		  console.error("Error retrieving users by group:", err);
	  }
  }

exports.getUserByEmail = async (email) => {
	console.log(email)
	try {
		const students = await User.findOne({ where: {email: email}})
		return students
	} catch (err) {
		console.error("Error retrieving user by email:", err);
	}
};


exports.getUserStats = async (userId) => {
	console.log(userId)
	try {
		const [results, metadata] = await sequelize.query(
			`

SELECT s3.*, m1.*,COALESCE(s3."problemId", m1."problemId") AS "problemId" from (
SELECT s1.*, s2.num_subs
FROM submissions AS s1
JOIN (
SELECT "problemId", MAX(created_time) AS max_created_time, COUNT("userId") as num_subs
FROM submissions
WHERE "userId" = :userId
GROUP BY "problemId"
) AS s2 ON s1."problemId" = s2."problemId" AND s1.created_time = s2.max_created_time) as s3
FULL OUTER JOIN (
SELECT "problemId", COUNT(sender_id) as num_messages
from messages
WHERE "sender_id" = :userId
GROUP BY "problemId"
) AS m1 ON s3."problemId" = m1."problemId"
    `,
			{
				replacements: { userId:userId },
			}
		)
		console.log(metadata)
		console.log(results)
		return results
	} catch (err) {
		console.error(err)
	}
}