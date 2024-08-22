import React, { useState, useEffect,Suspense } from 'react';
import api from '../../api/axios';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Button,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Toolbar,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom'; 
import Loading from '../loading.js';
import { useTranslation } from 'react-i18next';
import loader from '../loading.gif'



const Investmenttypes = () => {
  const { t, i18n } = useTranslation();
  const [types, settypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [investmentTypesToDelete, setinvestmentTypesToDelete] = useState(null); 
  const navigate = useNavigate();

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  const fetchtypes = async () => {
    try {
      const { data } = await api.get(`/types/getTypesByLanguage/${i18n.language}`);
      settypes(data);
    } catch (error) {
      toast.error(t('Errorfetchingtypes'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchtypes();
  }, [i18n.language]);

  const handleDeleteinvestmentTypes = async (id) => {
    try {
      await api.delete(`/types/deleteType/${id}`);
      settypes(types.filter(c => c._id !== id));
      toast.success(t('TypesDeletedSuccessfully'));
    } catch (error) {
      toast.error(t('ErrordeletingType'));
    }
  };

  const handleOpenConfirmDelete = (event, investmentTypes) => {
    setinvestmentTypesToDelete(investmentTypes);
  };

  const handleCloseConfirmDelete = () => {
    setinvestmentTypesToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (investmentTypesToDelete) {
      handleDeleteinvestmentTypes(investmentTypesToDelete._id);
      handleCloseConfirmDelete();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const safeLowerCase = (str) => (str ? str.toLowerCase() : '');

  const filteredtypes = types.filter(investmentTypes =>
    safeLowerCase(i18n.language === 'en' ? investmentTypes.type_en : investmentTypes.type_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investmentTypes.description : investmentTypes.description_ar).includes(safeLowerCase(search))
  );

  const columns = [
    {
      field: i18n.language === 'ar' ? 'type_ar' : 'type_en',
      headerName: t('name'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',

    },
    {
      field: i18n.language === 'ar' ? 'description_ar' : 'description_en',
      headerName: t('description'),
      flex: 2,
      align: i18n.language === 'ar' ? 'right' : 'left'

    },
    {
      field: 'actions',
      headerName: t('actions'),
      sortable: false,
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <Box display="flex" justifyContent="left">
          <IconButton
            sx={{ color: '#4CAF50', fontSize: 28 }}
            onClick={() => navigate(`/editinvestmentTypes/${params.row._id}`)}
          >
            <EditNoteIcon />
          </IconButton>
          <Tooltip
            title={
              <Box>
                <Typography sx={{ textAlign: 'center' }}>{t('areYouSure')}</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDelete}
                  size="small"
                >
                  {t('yes')}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseConfirmDelete}
                  size="small"
                  style={{ marginLeft: 8 }}
                >
                  {t('no')}
                </Button>
              </Box>
            }
            open={Boolean(investmentTypesToDelete === params.row)}
            onClose={handleCloseConfirmDelete}
            placement="right"
            arrow
          >
            <IconButton
              sx={{ color: '#FF5722', fontSize: 28 }}
              onClick={(event) => handleOpenConfirmDelete(event, params.row)}
            >
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('investmentTypesManagement')}
          </Typography>
          <TextField
            variant="standard"
            placeholder={t('search')}
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{
              ml: 2,
              bgcolor: 'darkorange',
              '&:hover': {
                bgcolor: 'orange',
              },
            }}
            startIcon={<AddIcon />}
            onClick={() => navigate('/addinvestmentTypes')}
          >
            {t('addinvestmentTypes')}
          </Button>
        </Toolbar>
        <div style={{ width: '100%', height: '100%' }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100%"
            >
              <img src={loader} alt="Loading..." />
            </Box>
          ) : (
            <StripedDataGrid
              rows={filteredtypes}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoHeight
              getRowId={(row) => row._id}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
              direction={i18n.language === 'ar'? 'rtl' : 'ltr'} 
                          />
          )}
        </div>
      </Paper>
    </Box>
    </Suspense>
  );
};

export default Investmenttypes;
