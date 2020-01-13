import {
  Box,
  Button,
  Container,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography as Text,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import { Check, ChevronLeft, ChevronRight } from '@material-ui/icons'
import { Field, FormikProps, withFormik } from 'formik'
import { TextField as FuiTextField } from 'formik-material-ui'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as Yup from 'yup'
import PrivateContainer from './PrivateContainer'

// on 'Finish' remove item from local storage

interface FormValues {
  email: string
  password: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stepper: {
      backgroundColor: 'transparent',
      margin: '0 -3em',
    },
  }),
)

const Step1: React.FC<any> = ({ activeStep, handleNext }): any => {
  const formName = 'onboardingForm'
  const storedValues = JSON.parse(window.localStorage.getItem(formName)) || null
  const getDefaultUrl = (name): string =>
    `https://${name.toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '')}.k8s-dev.otomi.cloud`

  const Step1Form = (
    formProps: FormikProps<{
      name: string
      source: any
      sourceUrl: string
    }>,
  ): any => {
    const { handleSubmit, isValid, isSubmitting, values } = formProps

    React.useEffect(() => {
      window.localStorage.setItem(formName, JSON.stringify(values))
    }, [values])

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name='name'
          label='Name of the app'
          component={FuiTextField}
          fullWidth
          variant='filled'
          margin='dense'
          InputProps={{
            disableUnderline: true,
          }}
        />
        <Field name='source' label='Source code location' as={RadioGroup}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <FormLabel>Source code location</FormLabel>
            <FormControlLabel value='git' control={<Radio />} label='Git' />
            <FormControlLabel value='docker' control={<Radio />} label='Docker' />
          </Box>
        </Field>
        <Field
          name='sourceUrl'
          label={values.source === 'git' ? 'Git repo URL' : 'Docker image name'}
          component={FuiTextField}
          fullWidth
          variant='filled'
          margin='dense'
          InputProps={{
            disableUnderline: true,
          }}
        />
        <div>{getDefaultUrl(values.name)}</div>
        <Box display='flex' justifyContent='space-between' pt={1}>
          <span></span>
          <Button
            type='submit'
            variant='contained'
            color='secondary'
            disabled={!isValid || isSubmitting}
            endIcon={<ChevronRight />}
          >
            Next
          </Button>
        </Box>
      </form>
    )
  }

  const validateGit = Yup.string()
    .required()
    .max(50)
    .matches(/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|#[-\d\w._]+?)$/, 'Invalid GitHub URL')
  const validateDocker = Yup.string()
    .required()
    .max(50)
    .matches(/[a-z0-9]+(?:[._-]{1,2}[a-z0-9]+)*$/, 'Invalid image name')
  const WithFormik = withFormik<any, FormValues>({
    mapPropsToValues: (): any =>
      storedValues
        ? storedValues
        : {
            name: '',
            source: 'git',
            sourceUrl: '',
          },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required()
        .max(50)
        .matches(/^[a-z ,.'-]+$/i),
      source: Yup.mixed()
        .required()
        .oneOf(['git', 'docker']),
      sourceUrl: Yup.string().when('source', source => {
        return source === 'git' ? validateGit : validateDocker
      }),
    }),
    handleSubmit: (): void => {
      handleNext()
    },
    validateOnMount: true,
  })(Step1Form)

  return (
    <React.Fragment>
      <WithFormik activeStep={activeStep} handleNext={handleNext} />
    </React.Fragment>
  )
}
const Step2: React.FunctionComponent<any> = (): any => {
  const [editUrl, setEditUrl] = React.useState(false)
  return (
    <React.Fragment>
      <FormControlLabel
        control={<Switch checked={editUrl} onChange={(): void => setEditUrl(!editUrl)} value='editUrl' />}
        label='Use a custom URL'
      />
      <TextField
        margin='dense'
        label='Your new url'
        fullWidth
        required
        variant='filled'
        type='url'
        disabled={!editUrl}
        InputProps={{
          disableUnderline: true,
          // readOnly: !editUrl,
        }}
      />
    </React.Fragment>
  )
}
const Step3: React.FC<any> = (): any => {
  return (
    <Box textAlign='center' my={3}>
      deploying...
      <LinearProgress />
    </Box>
  )
}

const OnboardingWizard: React.FC<RouteComponentProps> = (): any => {
  const steps = ['Name', 'URL', 'Deploy']
  const classes = useStyles({})
  const [activeStep, setActiveStep] = React.useState(0)
  const handleNext = (): void => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }
  const handleBack = (): void => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <PrivateContainer>
      <Container maxWidth='xs'>
        <Box textAlign='center'>
          <Box mt={12}>
            <Box p={2} textAlign='center'>
              <Text variant='h5' component='h1'>
                Add your app
              </Text>
            </Box>
            <React.Fragment>
              <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
                {steps.map(label => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box px={2} textAlign='left'>
                {activeStep === 0 && <Step1 activeStep={activeStep} handleNext={handleNext} />}
                {activeStep === 1 && <Step2 />}
                {activeStep === 2 && <Step3 />}
                <Box display='flex' justifyContent='space-between' pt={1}>
                  {activeStep > 0 ? (
                    <Button
                      disabled={activeStep === 0}
                      variant='outlined'
                      color='secondary'
                      onClick={handleBack}
                      startIcon={<ChevronLeft />}
                    >
                      Back
                    </Button>
                  ) : (
                    <span></span>
                  )}
                  {activeStep === 1 && (
                    <Button variant='contained' color='secondary' onClick={handleNext} startIcon={<Check />}>
                      Finish
                    </Button>
                  )}
                </Box>
              </Box>
            </React.Fragment>
          </Box>
        </Box>
      </Container>
    </PrivateContainer>
  )
}

export default OnboardingWizard
