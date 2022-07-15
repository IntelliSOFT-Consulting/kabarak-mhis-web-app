import { Typography, Stack, TextField, Button, Container, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../lib/cookie';
import { startVisit } from '../lib/startVisit';
import { FhirApi } from './../lib/api';

export default function PatientList() {
    let [patients, setPatients] = useState([])
    let navigate = useNavigate()

    let [selected, setSelected] = useState([])

    let getPatients = async () => {

        let data = await FhirApi({ url: '/fhir/Patient?_limit=50', method: 'GET' })
        let p = data.data.entry.map((i) => {
            let r = i.resource
            return {
                id: r.id, lastName: r.name[0].family, firstName: r.name[0].given[0],
                age: `${(Math.floor((new Date() - new Date(r.birthDate).getTime()) / 3.15576e+10))} years`
            }
        })
        setPatients(p)
    }

    let startPatientVisit = async () => {
        if (selected.length === 1) {
            startVisit(selected[0])
        }

    }


    let viewPatient = async () => {
        if (selected.length === 1) {
            navigate(`/patients/${selected[0]}`)
        }
        return
    }

    let deletePatients = async () => {
        if (selected.length > 0) {
            for (let i of selected) {
                let data = await FhirApi({ url: `/fhir/Patient/${i}?_cascade=delete`, method: 'DELETE' })
                console.log(data)
            }
            await getPatients()
            return

        }
        await getPatients()
        return
    }

    useEffect(() => {
        getPatients()
    }, [])

    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/patients")
            return
        }
    }, [])



    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 250, editable: true },
        { field: 'firstName', headerName: 'First Name', width: 250, editable: true },
        { field: 'age', headerName: 'Age', width: 200 },
        // { field: 'role', headerName: 'Date of admission', width: 150 }
    ];

    let isMobile = useMediaQuery('(max-width:600px)');
    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            <Layout>
                <br />
                <Container maxWidth="lg">
                    <br />
                    <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                        <TextField type={"text"} size="small" sx={{ width: "80%" }} placeholder='Patient Name or Patient ID' />
                        <Button variant="contained" size='small' sx={{ width: "20%", backgroundColor: "#632165" }} disableElevation>Search</Button>
                    </Stack>
                    <br />
                    <Stack direction="row" spacing={2} alignContent="right" >
                        {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 0) ? '30%' : '70%' }}></Typography>}
                        {(selected.length > 0) &&
                            <>
                                <Button variant="contained" onClick={e => { deletePatients() }} disableElevation sx={{ color: "#632165", backgroundColor: "white" }}> 🗑️Delete Patient{(selected.length > 1) && `s`}</Button>                        </>
                        }
                        {(selected.length === 1) &&
                            <>
                                <Button variant="contained" onClick={e => { startPatientVisit() }} disableElevation sx={{ backgroundColor: "#632165" }}>Start Visit</Button>
                                <Button variant="contained" onClick={e => { viewPatient() }} disableElevation sx={{ color: "#632165", backgroundColor: "white" }}>View Patient</Button>
                            </>
                        }
                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }} onClick={e => { navigate('/patient-registration') }}>Create New Patient</Button>
                    </Stack>
                    <br />
                    <DataGrid
                        loading={(patients && (patients.length > 0)) ? false : (patients.length === 0) ? false : true}
                        rows={patients ? patients : []}
                        columns={columns}
                        pageSize={30}
                        rowsPerPageOptions={[30]}
                        checkboxSelection
                        autoHeight
                        disableSelectionOnClick
                        onSelectionModelChange={e => { setSelected(e) }}
                        onCellEditStop={e => { console.log(e) }}
                    />
                </Container>
            </Layout>
        </>
    )

}




