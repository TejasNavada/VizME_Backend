const express = require('express')
const session = require('express-session')
const https = require('https')
const http = require('http')
const fs = require('fs')
const socketIo = require('socket.io')
const db = require('./postgre/db')
const VERSION = 'v1'
const listenForSubmissions = require('./postgre/listener/submissionListener')
const listenForProblem = require('./postgre/listener/problemListener')
const listenForMessage = require('./postgre/listener/messageListener')
// const listenForGroup = require('./postgre/listener/groupListener')
const { socketManager } = require('./services/socketService')
//const setupSwagger = require('./services/swaggerService')
const passport = require('./general/passportConfig')

const cors = require('cors')
//const { setTranscribeSocket } = require('./socket/transcribeSocket')
const { FRONTEND_DOMAINS } = require('./config/corsConstants')

const app = express()

app.use(cors({
  origin: FRONTEND_DOMAINS,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))
app.use(express.json())
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).send('Something broke!')
})
app.get('/', (req, res) => res.send('INDEX'))
app.use('/api/' + VERSION + '/problems', require('./routes/problemsRoute'))
app.use('/api/' + VERSION + '/users', require('./routes/usersRoute'))
app.use('/api/' + VERSION + '/chat', require('./routes/chatRoute'))
app.use('/api/' + VERSION + '/submissions', require('./routes/submissionsRoute'))
app.use('/api/' + VERSION, require('./routes/authRoute'))




app.use(passport.initialize())
app.use(passport.session())
// setupSwagger(app)

// const privateKey = fs.readFileSync('certificate/private.key', 'utf8')
// const certificate = fs.readFileSync('certificate/certificate.crt', 'utf8')
// const caBundle = fs.readFileSync('certificate/ca_bundle.crt', 'utf8')

// const credentials = { key: privateKey, cert: certificate, ca: caBundle }

const mode = process.env.NODE_ENV
let server = null
if (mode && mode === 'DEVELOPMENT') {
  server = http.createServer(app)
} else {
  //server = https.createServer(credentials, app)
}
const io = socketIo(server, {
  cors: {
    origin: FRONTEND_DOMAINS,
    methods: ["GET", "POST"],
    credentials: true
  }
})
socketManager(io)
//setTranscribeSocket(server)

db.authenticate()
  .then(() => {
    listenForSubmissions(io)
    listenForProblem(io)
    listenForMessage(io)
    // listenForGroup(io)
    console.log('Database connected...')
  })
  .catch(err => console.log('Error: ' + err))

const PORT = process.env.PORT || 5000

server.listen(PORT, console.log(`${mode}: Server started on port ${PORT}`))