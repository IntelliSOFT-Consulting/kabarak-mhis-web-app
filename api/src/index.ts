import express from "express";
import cors from 'cors'
import * as dotenv from 'dotenv'

dotenv.config() // Load environment variables

//Import routes 
import Index from './routes/main'
import Auth from './routes/auth'
import Users from './routes/users'
import Patients from './routes/patients'
import FHIR from './routes/fhir'
import Referrals from './routes/referrals'
import CRUD from './routes/crud'
import Reports from './routes/reports'




const app = express();
const PORT = 8080;

app.use(cors())

app.use('/', Index)

app.use('/auth', Auth)
app.use('/users', Users)
app.use('/patients', Patients)
app.use('/fhir', FHIR)
app.use('/referrals', Referrals)
app.use('/crud', CRUD)
app.use('/reports', Reports)




app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});