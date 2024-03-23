const employeeService = require("../service/employee");
const { bulkFileUpload } = require("../utils/bulkUpload");
const multer = require('multer')
const models = require("../models");
const { removeFile } = require("../utils/removeFile");
const fs = require('fs');
const { getCountries, getStatesByCountry, getCitiesByState,getDataBySelection } = require("../service/locationService");

const signUp = async (req, res) => {
    const result = await employeeService.register(req.body);
    res.status(result.status).json({ data: result.message, message: "Registered Successfully" });

};

const signIn = async (req, res) => {
    const result = await employeeService.login(req.body);
    res.status(result.status).json({ message: result });

};

const forgotPassword = async (req, res) => {
    const getEmployee = await employeeService.emailSend(req.body);
    res.status(200).json(getEmployee);
};


const changePassword = async (req, res) => {
    const getData = await employeeService.resetPassword(req.body);
    res.status(200).json(getData)
};

const bulkUpload = async (req, res) => {
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            const extArray = file.originalname.split(".");
            const extension = extArray[extArray.length - 1];
            cb(null, `${Date.now()}.${extension}`);
        },
        destination: "public/bulkUploads/"
    });

    const uploads = multer({
        storage,
        limits: { fileSize: 1024 * 1024 * 10 }, 
        fileFilter: function (req, file, cb) {
            if (file.originalname.endsWith('.xlsx')) {
                cb(null, true);
            } else {
                cb(new Error('File type not supported'));
            }
        }
    }).single("avatar");

    uploads(req, res, async err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        req.file.url = req.file.destination + req.file.filename;
        try {
            let uploadFile = await models.bulkUpload.create(req.file);
            res.status(200).json({ uploadFile });
        } catch (error) {
            res.status(500).json({ error: 'Error while uploading file' });
        }
    });
  
}


const BulkUploadStatus = async (req, res) => {
    let columnKeys = [ "name", "email","countryId", "stateId", "cityId", "departmentName", "designationName" ,"gender" ,"date_of_joining"];
    const parseFile = await bulkFileUpload(req.body.fileId, req.body.fileExtension, req.body.path,columnKeys);
    if (parseFile.error) {
        return { message: parseFile.message, error: true }
    }
    const uploadedData = parseFile.parsedArrray;
    const employeeBulkInsert = await employeeService.bulkCreateEmployee(uploadedData,req.body.fileId);
    if (employeeBulkInsert.error) {
        return res.status(404).json({
            message: employeeBulkInsert.message
        });
    }

    return res.status(200).json({
        message: employeeBulkInsert.message
    });

}


const getEmployeeData = async (req,res)=>{
    const getData = await employeeService.getEmployeeData(req.query);
    return res.status(getData.status).json({
        message:getData.message,
        data:getData.data
        
    })
}

const getCountrys = async (req,res)=>{
        const countries = await getCountries();
        res.json(countries);
}

const getStates = async (req,res)=>{
        const countryId = req.params.countryId;
        const states = await getStatesByCountry(countryId);
        res.json(states);
      
}
const getCitys = async (req,res)=>{
    
        const stateId = req.params.stateId;
        const cities = await getCitiesByState(stateId);
        res.json(cities);
}

const getEmployeeExcel = async(req,res)=>{
    const getEmployeeExcel = await employeeService.downloadEmployeeExcel();
    if(getEmployeeExcel.error){
        return res.status(getEmployeeExcel.status).json({
            data:getEmployeeExcel.data
        })
    }
    const stat = fs.statSync(getEmployeeExcel.options.filename);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader("Content-Disposition", "attachment; filename=" + `employeeReport${getEmployeeExcel.fileName}.xlsx`);
    res.setHeader('Content-Length', stat.size); 
    res.download(getEmployeeExcel.options.filename);
    removeFile(getEmployeeExcel.options.filename);
}

const getDetails = async (req, res) => {
   
      const selectionType = req.params.selectionType;
      const selectionId = req.params.selectionId;
      const data = await getDataBySelection(selectionType, selectionId);
      res.json(data);
    
  }


module.exports = {
    signUp,
    signIn,
    forgotPassword,
    changePassword,
    bulkUpload,
    BulkUploadStatus,
    getEmployeeData,
    getCountrys,
    getStates,
    getCitys,
    getEmployeeExcel,
    getDetails
}