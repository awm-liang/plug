import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  buttonsWrapper: {
    padding: '0 24px 30px',
  },
  innerContainer: {
    padding: '20px 25px 5px',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    margin: 0,
    background: 'white',
    borderRadius: '10px',
    width: '370px',
    height: '255px',
    padding: '18px 20px 22px',
  },
  modalTitle: {
    margin: '0',
    marginBottom: '14px',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#111827',
  },
  modalText: {
    margin: '0',
    marginBottom: '20px',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#374151',
  },
  modalContainer: {
    width: '100%',
    position: 'absolute',
    margin: '-147px auto 0',
    top: '50%',
    zIndex: 1000000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'transparent',
  },
  backdropContainer: {
    position: 'relative',
  },
  mainContainer: {
    backgroundColor: 'white',
  },
  backdropOpacity: {
    background: 'rgb(206, 208, 213)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundOpacity: {
    opacity: 0.4,
  },
  modalLink: {
    margin: '19px 0 0',
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'center',
    width: '100%',
    color: '#3574F4',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:visited': {
      textDecoration: 'none',
      color: '#3574F4',
    },
  },
  dataTabs: {
    width: '100%',
    display: 'flex',
    marginBottom: 20,
    paddingRight: 20,
    maxWidth: 400,
    overflow: 'auto',
    position: 'relative',
  },
  dataTab: {
    border: 0,
    scrollbarWidth: 'thin',
    color: '#6B7280',
    height: 35,
    padding: '10px 15px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    minWidth: 'fit-content',
  },
  selectedTab: {
    color: '#3574F4',
    backgroundColor: 'rgba(53, 116, 244, 0.2)',
    fontWeight: 'bold',
  },
}));
