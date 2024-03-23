var express = require('express');
const {  signIn ,forgotPassword , changePassword, bulkUpload, BulkUploadStatus , getEmployeeData, getCountrys, getStates, getCitys, getEmployeeExcel, signUp,getDetails} = require('../controller/employee');
const { wrapper } = require('../utils/errorWrap');
const { verifyToken } = require('../middleware/checkAuth');
const { empValidation } = require('../validation/register');
const validationError = require('../middleware/validationError');
var router = express.Router();

/* GET emp listing. */
router.post('/sign-up',empValidation,validationError, wrapper(signUp))
router.post('/sign-in', wrapper(signIn))
router.post('/forgot-password',verifyToken, wrapper(forgotPassword))
router.post('/change-Password',verifyToken, wrapper(changePassword))
router.post('/bulk-upload',verifyToken,wrapper(bulkUpload))
router.post('/bulk-create',verifyToken,wrapper(BulkUploadStatus))
router.get('/emp-detail',verifyToken,wrapper(getEmployeeData))
router.get('/country-list',wrapper(getCountrys))
router.get('/state-list/:countryId',wrapper(getStates))
router.get('/city-list/:stateId',wrapper(getCitys))
router.get('/data/:selectionType/:selectionId' ,wrapper(getDetails));  // for selection
router.get('/download-file',wrapper(getEmployeeExcel))

module.exports = router;
