import React, { useState } from 'react';
import XLSX from 'xlsx';
import {
  Avatar,
  Divider,
  Typography,
  Container,
  Paper,
  Grid,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Chip,
} from '@material-ui/core/';
import {
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Storage as StorageIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import handleworkbook from '../../libs/handleworkbook';

const { sheetToJSON, createWorkbook } = handleworkbook;

const SheetJSFT = ['xlsx', 'xls'].map(x => `.${x}`).join(',');

const styles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  button: {
    margin: theme.spacing(0),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  chip: {
    margin: theme.spacing(2),
  },
  input: {
    display: 'none',
    margin: theme.spacing(0),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  label: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    maxWidth: 'lg',
  },
}));

const INITIAL_STATE = {
  typeCollection: '',
  typeData: '',
  file: '',
  data: [],
  error: '',
};

const CollectionForm = () => {
  const classes = styles();
  const [state, setState] = useState(INITIAL_STATE);

  const handleFile = async file => {
    // Boilerplate to set up FileReader
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      // Parse data
      const { typeCollection } = state;
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      sheetToJSON(workbook, typeCollection)
        .then(data => {
          setState({ ...state, data });
        })
        .catch(error => {
          const { message } = error;
          setState({ ...state, error: message });
        });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const exportFile = async () => {
    const { data: JSONDATA, typeCollection: collection, typeData: data } = state;
    await createWorkbook(JSONDATA, { collection, data })
      .then(workbook => {
        const { wb, filename } = workbook;
        XLSX.writeFile(wb, filename);
      })
      .catch(error => {
        const { message } = error;
        setState({ ...state, error: message });
      });
  };

  const onChange = event => {
    const { target } = event;
    const { value, name, files } = target;
    setState({
      ...state,
      [name]: value,
    });
    if (files && files[0]) {
      const nameFile = files[0].name;
      // eslint-disable-next-line no-useless-escape
      const regexWoorBook = /([a-zA-Z0-9\s_\\.\-\(\):])+(.xlsx|.xls)$/;
      const isWoorBook = regexWoorBook.test(nameFile);
      if (!isWoorBook) {
        setState({
          ...state,
          error: 'Archivo invalido, solo se aceptan archivos con extensión  .xlsx o .xls',
        });
      }
      if (isWoorBook) {
        handleFile(files[0]);
      }
    }
  };

  const onDelete = () => {
    setState({ ...INITIAL_STATE });
  };

  const { typeCollection, typeData, data, error } = state;
  const isInvalid = typeCollection === '' || typeData === '' || data.length === 0;
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper}>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} align="center">
            <Avatar className={classes.avatar}>
              <StorageIcon />
            </Avatar>
            <Typography component="h1" variant="h4" align="center">
              Checkout
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Tipo de colección</FormLabel>
              <RadioGroup
                aria-label="Tipo de colección"
                name="typeCollection"
                className={classes.group}
                value={typeCollection}
                onChange={onChange}
              >
                <FormControlLabel value="dupla" control={<Radio />} label="Dupla" />
                <FormControlLabel value="tuple" control={<Radio />} label="Tupla" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Tipo de datos</FormLabel>
              <RadioGroup
                aria-label="Tipo de datos"
                name="typeData"
                className={classes.group}
                value={typeData}
                onChange={onChange}
              >
                <FormControlLabel value="email" control={<Radio />} label="E-mail" />
                <FormControlLabel value="phone" control={<Radio />} label="Teléfono" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            container
            direction="column"
            justify="space-around"
            alignItems="center"
          >
            <label htmlFor="contained-button-file" className={classes.label}>
              <input
                accept={SheetJSFT}
                className={classes.input}
                id="contained-button-file"
                type="file"
                name="file"
                onChange={onChange}
              />
              <Button
                fullWidth
                variant="contained"
                component="span"
                color="secondary"
                className={classes.button}
              >
                Upload
                <CloudUploadIcon className={classes.rightIcon} />
              </Button>
            </label>
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              disabled={isInvalid}
              className={classes.submit}
              onClick={exportFile}
            >
              Download
              <CloudDownloadIcon className={classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>
        {error && (
          <React.Fragment key="error">
            <Divider className={classes.divider} />
            <Chip
              label={error}
              variant="outlined"
              onDelete={onDelete}
              className={classes.chip}
              color="secondary"
            />
          </React.Fragment>
        )}
      </Paper>
    </Container>
  );
};

export default CollectionForm;
