import React, {Fragment, useEffect, useState} from 'react';
import Breadcrumb from '../common/breadcrumb';
import useForm from 'react-hook-form' // useForm should be destructured from the default export
import {toast} from "react-toastify";
import axios from "axios";
import ImageUploader from "react-images-upload";

const FormValidation = () => {
    const { register, handleSubmit, errors } = useForm(); // initialise the hook
    const [clients, setClients] = useState('');
    const [disciplines, setDisciplines] = useState('');

    // job methods
    useEffect(() => {
        axios
            .get(
                `${backEndAPIUrl}getJobMethods`,
                {
                    headers: {
                        'Authorization' : 'Bearer ' + sessionStorage.getItem("token"),
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept' : 'application/json'
                    }
                }
            )
            .then(response => {
                const optionItems = response.data.jobMethods.map((jobMethod, index) =>
                    <option key={index.id} value={index.id}>{index.name}</option>
                    // `index` is the index of the each item in the array. you should replace `index` with `jobMethod`.
                );

                setJobMethods(optionItems);
                // No function named setJobMethods. Not defined such state.
            })
            .catch((error) => {
                console.error(error);
            });
    });

    const onSubmit = data => {
        if (data != '') {
            const jsonData = JSON.stringify(data);

            axios
                .post(
                    `${backEndAPIUrl}createJob`,
                    jsonData,
                    {
                        headers: {
                            'Authorization' : 'Bearer ' + sessionStorage.getItem("token"),
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept' : 'application/json'
                        }
                    }
                )
                .then(response => {
                    console.log(response);
                    if (response.status = 200) { // wrong conditional operator. Use (==) or(===) insted (=)
                        if (typeof response.data.error != 'undefined') {
                            if (typeof response.data.error.job_number != 'undefined') {
                                setTimeout(() => {
                                    toast.error("This Job Number is already taken.");
                                }, 200);
                            }
                        }

                        if (typeof response.data.message != 'undefined') {
                            setTimeout(() => {
                                toast.success("Job has been created.");
                            }, 3000);
                            document.getElementById("create_job_form").reset();
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            errors.showMessages();
        }
    };

    return (
        <Fragment>
            <Breadcrumb title="Create Job" parent="Operations" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <form
                            className="needs-validation"
                            noValidate=""
                            id="create_job_form"
                        >
                        <!-- Not driving submit. your should assign handleSubmit(onSubmit) into onSubmit prop -->
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-row">
                                        <div className="col-md-1 mb-3">
                                            <label htmlFor="job_number">Job #</label>
                                            <input
                                                className="form-control"
                                                name="job_number"
                                                type="text"
                                                ref={register({ required: true })}
                                            />
                                            <span>{errors.job_number && 'Job number is required'}</span>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="contract_date">Contract Date</label>
                                            <input
                                                className="form-control"
                                                name="contract_date"
                                                id="contract_date"
                                                type="date"
                                                ref={register({ required: true })}
                                            />
                                            <span>{errors.contract_date && 'Contract Date is required'}</span>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="client_id">Client</label>
                                            <select
                                                className="form-control"
                                                name="client_id"
                                                id="client_id"
                                                ref={register({ required: true })}
                                            >
                                                <option value=""/>
                                                {clients}
                                            </select>
                                            <span>{errors.client_id && 'Please select Client'}</span>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="job_start_date">Start Date</label>
                                            <input
                                                className="form-control"
                                                name="job_start_date"
                                                id="job_start_date"
                                                type="text"
                                                ref={register({ required: true })}
                                            />
                                            <span>{errors.start_date && 'Job Start Date is required'}</span>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="projected_close_date">Close Date</label>
                                            <input
                                                className="form-control"
                                                name="projected_close_date"
                                                id="projected_close_date"
                                                type="text"
                                                ref={register({ required: true })}
                                            />
                                            <span>{errors.projected_close_date && 'Projected Close Date is required'}</span>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-md-7 mb-3">
                                            <label htmlFor="notes">Notes</label>
                                            <textarea
                                                className="form-control"
                                                type="text"
                                                name="notes"
                                                id="notes"
                                                rows="3"
                                                cols="33"
                                                ref={register({required: false})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <h4>Billing Details</h4>
                                    <div className="form-row">
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="job_method_id">Job Method</label>
                                            <select
                                                className="form-control"
                                                name="job_method_id"
                                                id="job_method_id"
                                                ref={register({ required: true })}
                                            >
                                                <option value=""/>
                                                {jobMethods}
                                            </select>
                                            <span>{errors.job_method_id && 'Please Select Job Method.'}</span>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="ap_email">Email</label>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                </div>
                                                <input
                                                    className="form-control"
                                                    name="ap_email"
                                                    type="email"
                                                    id="ap_email"
                                                    aria-describedby="inputGroupPrepend"
                                                    ref={register({ required: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="ap_contact_number">Contact #</label>
                                            <input
                                                className="form-control"
                                                id="ap_contact_number"
                                                name="ap_contact_number"
                                                type="number"
                                                ref={register({ required: false })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col-md-5 mb-3">
                                            <label htmlFor="billing_address">Address</label>
                                            <input
                                                className="form-control"
                                                id="billing_address"
                                                name="billing_address"
                                                type="text" ref={register({ required: false })}
                                            />
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="billing_city">City</label>
                                            <input
                                                className="form-control"
                                                id="billing_city"
                                                name="billing_city"
                                                type="number" ref={register({ required: false })}
                                            />
                                        </div>
                                        <div className="col-md-1 mb-3">
                                            <label htmlFor="billing_state">State</label>
                                            <select
                                                className="form-control"
                                                name="billing_state"
                                                id="billing_state"
                                                ref={register({ required: false })}
                                            >
                                                <option value=""/>
                                                {statesInfo}
                                            </select>
                                        </div>
                                        <div className="col-md-1 mb-3">
                                            <label htmlFor="billing_zip">Zip</label>
                                            <input
                                                className="form-control"
                                                id="billing_zip"
                                                name="billing_zip"
                                                type="number"
                                                ref={register({ required: false })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <h4>Productivity Expectations Section</h4>
                                    <div className="form-row">
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="expected_shift_average">Expected Shift Average</label>
                                            <input
                                                className="form-control"
                                                id="expected_shift_average"
                                                name="expected_shift_average"
                                                type="text" ref={register({ required: false })}
                                                <!-- Missing `>` -->
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="expected_ft_per_shift">Expected FT./Shift</label>
                                            <input
                                                className="form-control"
                                                id="expected_ft_per_shift"
                                                name="expected_ft_per_shift"
                                                type="text" ref={register({ required: false })}
                                                <!-- Missing `>` -->
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="expected_billed_percentage">Expected Billed %</label>
                                            <input
                                                className="form-control"
                                                id="expected_billed_percentage"
                                                name="expected_billed_percentage"
                                                type="number"
                                                ref={register({ required: false })}
                                                <!-- Missing `>` -->
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="expected_drilling_percentage">Expected Drilling %</label>
                                            <input
                                                className="form-control"
                                                id="expected_drilling_percentage"
                                                name="expected_drilling_percentage"
                                                type="number"
                                                ref={register({ required: false })}
                                            />
                                            <!-- Use `>` instead `/>` -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-md-3 mb-3">
                                        <ImageUploader
                                            withIcon={false}
                                            id="image_uploader"
                                            withPreview={true}
                                            label="Choose file to upload"
                                            buttonText="Choose File"
                                            // onChange={onDrop}
                                            imgExtension={[".jpg", ".jpeg", ".png"]}
                                            maxFileSize={1048576}
                                            fileSizeError=" file is too big"
                                        />
                                    </div>
                                </div>
                            </div>
                        <button className="btn btn-primary" type="submit">Create</button>
                        <!-- No closing tag for `form` -->
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default FormValidation;
