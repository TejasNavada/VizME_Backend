const submissionService = require('../services/submissionService')

exports.createSubmission = async (req, res, next) => {
  try {
    const submission = await submissionService.createSubmission(req.body.submission,req.body.error,req.body.equations)
    res.json({ submission: submission })
  } catch (err) {
    res.status(500).send('Something broke!')
  }
}
exports.getUserSubmissions = async (req, res, next) => {
	try {
		const submissions = await submissionService.getUserSubmissions(req.params.id,req.params.user);
		res.json({ submissions: submissions });
	} catch (err) {
		next(err);
	}
};
exports.getUserEquationsBySubId = async (req, res, next) => {
	try {
		const submissions = await submissionService.getUserEquationsBySubId(req.params.id);
		res.json({ submissions: submissions });
	} catch (err) {
		next(err);
	}
};


exports.getProblemSubmissions = async (req, res, next) => {
	try {
		const submissions = await submissionService.getProblemSubmissions(req.params.id);
		res.json({ submissions: submissions });
	} catch (err) {
		next(err);
	}
};

exports.getSubmissionById = async (req, res, next) => {
	try {
		const submission = await submissionService.getSubmissionById(req.params.id);
		res.json({ submission: submission });
	} catch (err) {
		next(err);
	}
};