import Help from './Help'

const CustomDescriptionField: React.FC = ({ id, description }: any): any => {
  return <Help description={description} id={id} />
}

export default CustomDescriptionField
