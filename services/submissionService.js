const sequelize = require("../postgre/db")
const initModels = require("../models/init-models")
const error = require("../models/error")
const Submission = initModels(sequelize).submission
const Error = initModels(sequelize).submission_error
const User_Equations = initModels(sequelize).user_equation



exports.list = async () => {
	try {
	  return await Submission.findAll()
	} catch (err) {
	  console.log(err)
	}
  }
  
  exports.getSubmissionById = async (id) => {
	try {
	  return await Submission.findByPk(id)
	} catch (err) {
	  console.log(err)
	}
  }
  

  
  exports.updateSubmission = async (submission) => {
	try {
	  return await Submission.update(submission, {
		where: {
		  submissionId: submission.submissionId,
		},
	  })
	} catch (err) {
	  console.log(err)
	}
  }
  

  
  exports.getUserSubmissions = async (problemId,userId) => {
	  try {
		  const submissions = await Submission.findAll({ where: { problemId: problemId,userId:userId } });
  
		  return submissions;
	  } catch (err) {
		  console.error(err);
	  }
  };
exports.getUserEquationsBySubId = async (submissionId) => {
	try {
		const submissions = await User_Equations.findAll({ where: { submissionId: submissionId } });

		return submissions;
	} catch (err) {
		console.error(err);
	}
};
  
  exports.getProblemSubmissions = async (problemId) => {
	  try {
		  const submissions = await Submission.findAll({ where: { problemId: problemId } });
  
		  return submissions;
	  } catch (err) {
		  console.error(err);
	  }
  };

exports.deleteSubmissionById = async (id) => {
	try {
		await Error.destroy({
			where: { submissionId: id }
		})
		await User_Equations.destroy({
			where: { submissionId: id }
		})
		await Submission.destroy({
			where: { submissionId: id }
		})
	} catch (err) {
		console.log(err)
	}
}

exports.createSubmission = async (submission,error,equations) => {
	console.log(submission)
	console.log(error)
	console.log(equations)
	try {
		let sub = await Submission.create({
			problemId:submission.problemId,
			userId:submission.userId,
			pass: submission.pass,
			created_time: new Date()
			
		})
		if(error){
			let error = await Error.create({
				submissionId:sub.submissionId,
				errName:error.name,
				message:error.message,
				stack:error.stack
			})
		}
		for(let i = 0; i < equations.length; i++){
			await User_Equations.create({
				submissionId:sub.submissionId,
				equation:equations[i]
			})
		}
	} catch (err) {
		console.log(err)
	}
}