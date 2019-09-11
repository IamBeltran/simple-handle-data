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
  LinearProgress,
} from '@material-ui/core/';
import {
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Storage as StorageIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import handleworkbook from '../../lib/handleWorkbook';

const { sheetToJSON, createWorkbook } = handleworkbook;

// eslint-disable-next-line no-useless-escape
const regexWoorBook = /([a-zA-Z0-9\s_\\.\-\(\):])+(.xlsx|.xls)$/;
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

const CollectionForm = () => {
  const classes = styles();
  const [error, setError] = useState(null);
  const [collection, setCollection] = useState('');
  const [type, setType] = useState('');
  const [data, setData] = useState([]);
  const [hasFile, setHasFile] = useState(null);
  const [load, setload] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  const resetState = () => {
    setError(null);
    setCollection('');
    setType('');
    setHasFile(null);
    setData([]);
    setInputKey(Date.now());
  };

  const handleFile = async file => {
    // Boilerplate to set up FileReader
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      // Parse data
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      sheetToJSON(workbook, collection)
        .then(result => {
          setData(result);
        })
        .catch(err => {
          const { message } = err;
          setError(message);
        });
    };
    reader.onloadstart = () => {
      setload(true);
    };
    reader.onloadend = () => {
      setload(false);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const exportFile = async () => {
    await createWorkbook(data, { collection, data: type })
      .then(result => {
        const { workbook, filename } = result;
        if (XLSX.writeFile(workbook, filename)) {
          resetState();
        }
      })
      .catch(err => {
        const { message } = err;
        setError(message);
      });
  };

  const uploadFile = async fileList => {
    if (collection !== '' && type !== '' && fileList && fileList[0]) {
      const nameFile = fileList[0].name;
      const isWoorBook = regexWoorBook.test(nameFile);
      if (!isWoorBook) {
        setError('Archivo invalido, solo se aceptan archivos con extensión  .xlsx o .xls');
      }
      if (isWoorBook) {
        setHasFile(true);
        handleFile(fileList[0]);
      }
    }
  };

  const hasSettings = collection !== '' && type !== '';
  const hasData = data.length > 0;
  const disableRadio = hasData || error || hasFile || load;
  const disableUpload = hasData || !hasSettings || load || error;
  const disableDownload = !hasSettings || !hasData;

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper}>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} align="center">
            <Avatar className={classes.avatar}>
              <StorageIcon />
            </Avatar>
            <Typography component="h1" variant="h4" align="center">
              Opciones
            </Typography>
          </Grid>
        </Grid>
        {load && <br />}
        {load && <LinearProgress color="secondary" />}
        <Divider className={classes.divider} />

        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Tipo de colección</FormLabel>
              <RadioGroup
                aria-label="Tipo de colección"
                name="typeCollection"
                className={classes.group}
                value={collection}
                onChange={event => setCollection(event.target.value)}
              >
                <FormControlLabel
                  value="dupla"
                  disabled={disableRadio}
                  control={<Radio />}
                  label="Dupla"
                />
                <FormControlLabel
                  value="tuple"
                  disabled={disableRadio}
                  control={<Radio />}
                  label="Tupla"
                />
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
                value={type}
                onChange={event => setType(event.target.value)}
              >
                <FormControlLabel
                  value="email"
                  disabled={disableRadio}
                  control={<Radio />}
                  label="E-mail"
                />
                <FormControlLabel
                  value="phone"
                  disabled={disableRadio}
                  control={<Radio />}
                  label="Teléfono"
                />
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
                key={inputKey}
                onChange={event => uploadFile(event.target.files)}
              />
              <Button
                fullWidth
                variant="contained"
                component="span"
                color="secondary"
                disabled={disableUpload}
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
              disabled={disableDownload}
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
              onDelete={resetState}
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
