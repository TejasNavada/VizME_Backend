const express = require('express')
const submissionController = require('../controllers/submissionController')
const router = express.Router()

router.post('/', (req, res, next) => {
  return submissionController.createSubmission(req, res, next)
})
router.get("/problem/:id", (req, res, next) => {
	return submissionController.getProblemSubmissions(req, res, next);
});

router.get("/equation/:id", (req, res, next) => {
	return submissionController.getUserEquationsBySubId(req, res, next);
});

router.get("/:id/:user", (req, res, next) => {
	return submissionController.getUserSubmissions(req, res, next);
});



router.get("/:id", (req, res, next) => {
	return submissionController.getSubmissionById(req, res, next);
});



module.exports = router