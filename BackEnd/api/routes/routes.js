const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs-extra');

//imported file model
const file1 = require('../model/model');

const Employee = require('../model/dataModel');

//additional information about how to store a file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const upload = multer({ storage: storage });

//GET Request
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    file1.findById({ _id: id }).exec().then(result => {
        const path = result.filePath
        const ress = excelToJson({
            sourceFile: path,
            columnToKey: { '*': '{{columnHeader}}' },
            header:
            {
                rows: 1
            }
        })
        ress.filePath = path;
        res.status(200).json(ress);
        // fs.remove(path,err=>{
        //     if(err) return console.error(err);
        //     console.log(path+':file has been deleted');
        // })
    }).catch()
})


//POST Request
router.post('/', upload.single('excelFile'), (req, res, next) => {
    if (req.file)
    {
        const userFile = new file1({
            _id: mongoose.Types.ObjectId(),
            filePath: req.file.path
        });
        userFile.save()
            .then(result => {
                //console.log(result);
                return res.status(201).json({ message: 'handling POST request', userFile: userFile })
            })
            .catch(err => console.log(err));
    }
    else
    {
        var newManager=[];
        addData();
        console.log('in else');
        async function addData()
        {
            arrayOE = JSON.parse(req.body.employees);
            arrayOM = JSON.parse(req.body.managers);
            console.log(arrayOM);
            console.log('in function');
            for(const manager of arrayOM)
            {
                console.log('in manager');
                employee = new Employee({
                    _id: mongoose.Types.ObjectId(),
                    emp_code: manager.emp_code,
                    mng_code:'-',
                    firstName:manager.mngName,
                    lastName:manager.mngLastName,
                    email:manager.mngEmail,
                    status:manager.mngStatus
                })
                try
                {
                    await employee.save()
                    .then((result)=>{
                        console.log('result:'+result)
                        
                        newManager.push(result);
                        //res.send({message:'Manager Successfully Added',manager:result})
                    })
                    .catch((err)=>{res.status(400).json({error:err})})
                }
                catch(e)
                {
                    console.log(e);
                }
            }
        
            for(const man of newManager)
            {   
                for(const emp of arrayOE)
                {
                    if(man.emp_code === emp.mng_code)
                    {
                        
                        employee = new Employee({  
                            emp_code: mongoose.Types.ObjectId(),
                            mng_code:  man._id,
                            firstName: emp.empName,
                            lastName: emp.empLastName,
                            email:  emp.empEmail,
                            status: emp.empStatus
                        })
                        try
                        {
                            console.log('employee:'+employee);
                            await employee.save()
                            .then((result) => {
                                //res.send({ message: 'employee Successfully Added', data: result })
                            })
                            .catch((error) => res.status(404).json({error: error}))
                        }
                        catch(e)
                        {
                            console.log(e);
                        }
                    }
                }   
            }  
        }
        res.status(201).json({message:"All Records have been inserted"})
    }
})




//PATCH Request
router.patch('/', (req, res, next) => {
    res.status(200).json({ message: 'handling PATCH request' })
})

//DELETE Request
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('id:', id);
    file1.findById({ _id: id }).exec().then(result => {
        const path = result.filePath
        fs.remove(path, err => {
            if (err) return console.error(err);
            console.log(path + ':file has been deleted');
        })
    }).catch()
})

module.exports = router;
