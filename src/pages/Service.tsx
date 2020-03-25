import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Loader from '../components/Loader'
import Service from '../components/Service'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'
import { Divider, Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';

const Submit = ({ data }): any => {
  const { teamId, name } = data
  let method
  let filter
  if (data.serviceId) {
    method = 'editService'
    filter = { teamId, name }
  } else {
    method = 'createService'
  }
  const [result] = useApi(method, filter, data)
  if (result) {
    return <Redirect to={`/teams/${teamId}/services`} />
  }
  return null
}

const Delete = ({teamId, name}): any => {
  const method = 'deleteService'
  const filter = { teamId , name }
  const [result] = useApi(method, filter, null)
  if (result) {
    return <Redirect to={`/teams/${teamId}/services`} />
  }

  return null
}

const EditService = ({ teamId, serviceName, clusters, onSubmit, onDelete }): any => {
  const [service, serviceLoading, serviceError]: [any, boolean, Error] = useApi('getService', {
    teamId,
    name: serviceName,
  })

  if (serviceLoading) {
    return <Loader />
  }
  if (serviceError) {
    return null
  }
  return (
    <React.Fragment>
      <Service service={service} clusters={clusters} onSubmit={onSubmit} />
      <Divider />
      <Box display="flex" flexDirection="row-reverse" p={1} m={1}>
        <Button
          variant="contained"
          color="primary"
          className={"DeleteService"}
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Box>


    </React.Fragment>

    )}

export default ({
  match: {
    params: { teamId, serviceName },
  },
}): any => {
  const { isAdmin, team: sessTeam, clusters } = useSession()
  if (!isAdmin && teamId !== sessTeam.name) {
    return <p>Unauthorized!</p>
  }
  const [team, loading, error]: [any, boolean, Error] = useApi('getTeam', teamId)
  const [formdata, setFormdata] = useState()
  const [deleteService, setDeleteService] = useState()


  return (
    <MainLayout>
      {loading && <Loader />}
      {team && serviceName && formdata && <Service clusters={clusters} onSubmit={setFormdata} service={formdata} />}
      {team && serviceName && !formdata && (
        <React.Fragment>
        <EditService teamId={teamId} serviceName={serviceName} clusters={clusters} onSubmit={setFormdata} onDelete={setDeleteService}/>
        {deleteService && <Delete teamId={teamId} name={serviceName} />}
      </React.Fragment>
      )}
      {team && !serviceName && !formdata && <Service clusters={clusters} onSubmit={setFormdata} />}
      {formdata && <Submit data={formdata} />}
    </MainLayout>
  )
}
