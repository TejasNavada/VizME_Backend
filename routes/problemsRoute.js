const express = require("express")
const router = express.Router()
const ProblemController = require("../controllers/problemController")

/**
 * @openapi
 * /problems:
 *   get:
 *     summary: List all problems
 *     responses:
 *       200:
 *         description: Returns a list of problems
 */
router.get("/", (req, res, next) => {
	return ProblemController.list(req, res, next)
})

/**
 * @openapi
 * /problems:
 *   post:
 *     summary: Create a new problem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session created successfully
 */
router.post("/", (req, res, next) => {
	return ProblemController.createProblem(req, res, next)
})

/**
 * @openapi
 * /problems/{id}:
 *   get:
 *     summary: Get a problem by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: problem ID
 *     responses:
 *       200:
 *         description: problem details
 */
router.get("/:id", (req, res, next) => {
	return ProblemController.getProblemById(req, res, next)
})

/**
 * @openapi
 * /problems/variables/{id}:
 *   get:
 *     summary: Get a problem variables by problem ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: problem ID
 *     responses:
 *       200:
 *         description: problem details
 */
router.get("/variables/:id", (req, res, next) => {
	return ProblemController.getVariablesByProblemId(req, res, next)
})

router.delete("/:id", (req, res, next) => {
	return ProblemController.deleteProblemById(req, res, next)
})


/**
 * @openapi
 * /problems/{id}:
 *   put:
 *     summary: Update a problem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: problem ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: problem updated successfully
 */
router.put("/:id", (req, res, next) => {
	return ProblemController.updateProblem(req, res, next)
})

router.get("/:id/submissions", (req, res, next) => {
	return ProblemController.getSubmissions(req, res, next)
})





module.exports = router
