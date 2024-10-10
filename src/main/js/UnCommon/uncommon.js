/**
 *
 */
/*var UpiValidator = {c
        validators: {
            notEmpty: {
                message: 'The UPI is required'
            },
        }
    };*/
    var save_flag=0;
$(document).ready(function () {
	 var bankForm = $('#unCommon_form_8');
       bankForm.formValidation({
        framework: 'bootstrap',
        excluded: ":disabled",
        /*live:'disabled', */
        button: {
            selector: "#save_bank,#save_and_create_bank",
            disabled: "disabled"
        },
        icon: null,
        fields: {
            bankName: {
                validators: {
                    notEmpty: {
                        message: 'The bank name is required'
                    },
                    stringLength: {
                        max: 50,
                        message: 'The bank name must be less than 50 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\s., ]+$/,
                        message: 'The bank name can only consist of alphabetical, number and underscore'
                    }
                }
            },
            bankBranch: {
                validators: {
                    notEmpty: {
                        message: 'The branch name is required again'
                    },
                    stringLength: {
                        max: 50,
                        message: 'The branch name must be less than 50 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\s., ]+$/,
                        message: 'The branch name can only consist of alphabetical, number and underscore'
                    }
                }
            },
            accountHolderName: {
                validators: {
                    stringLength: {
                        max: 50,
                        message: 'The account holder name name must be less than 50 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\s., ]+$/,
                        message: 'The account holder name name can only consist of alphabetical, number and underscore'
                    }
                }
            },
            bankAcNo: {
                validators: {
	 				notEmpty: {
                        message: 'The bank Account no is required'
                    },
                    stringLength: {
                        max: 20,
                        message: 'The bank Account no must be 20 digit long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/, // /[a-zA-Z0-9*[^\s]$/,
                        message: 'The bank Account no can only consist of alphabetical and number'
                    },
                    remote: {
                    message: 'The bank Account is already exist. ',
                    url: "/bank/checkaccountno",
                    type: 'POST',
                    data: function (validator, $field, value) {
                        var id = $("#bankId").val();
                        return {
                            bankId: id ? id : '0',
                        };
                    },
                },
                }
            },
            ifscCode: {
                validators: {
                    stringLength: {
                                max: 11,
                                message: 'The ifsc code must be less than 11 characters long'
                            },
                            regexp: {
                            	 regexp: /^[A-Z]{4}[0][A-Za-z0-9]{6}$/,
                                message: 'The ifsc code can only consist of alphabetical and number'
                            }
                }
            },
            swiftCode: {
                validators: {
                    stringLength: {
                        max: 50,
                        message: 'The swift code must be less than 50 characters long'
                    },
                    regexp: {
                        regexp: /[a-zA-Z0-9]$/,
                        message: 'The swift code can only consist of alphabetical and number'
                    }
                }
            },

            addressLine1: {
                validators: {
                    stringLength: {
                        max: 80,
                        message: 'The address line 1 must be less than 80 characters long'
                    }
                }
            },
            addressLine2: {
                validators: {
                    stringLength: {
                        max: 80,
                        message: 'The address line 2 must be less than 80 characters long'
                    }
                }
            },
            countriesCode: {
                validators: {
                    notEmpty: {
                        message: 'select country'
                    }
                }
            },
            stateCode: {
                validators: {
                    notEmpty: {
                        message: 'select state'
                    }
                }
            },
            cityCode: {
                validators: {
                    notEmpty: {
                        message: 'select city'
                    }
                }
            },
           pinCode: {
                validators: {
                    
                    regexp: {
                        regexp: /^[0-9+]+$/,
                        message: 'The ZIP/Postal code can only consist numeric value'
                    },
                    stringLength: {
                        max: 6,
                        message: 'The ZIP/Postal code can only consist 6 digit number'
                    }
                    
                }
            },
        }
    });
     $('#isUpiAvailable').click(function () {
            if ($(this).is(':checked')) {
                $(this).val(1);
                //$("#upi_div").removeClass("m--hide");
                //$('#bank_form').formValidation('addField', "upi", UpiValidator);
            } else {
                $("#upi_div").addClass("m--hide");
                $(this).val(0);
                //$('#bank_form').formValidation('removeField', "upi");
            }
        });
        
        if ($("#isUpiAvailable").is(':checked')) {
                //$('#bank_form').formValidation('addField', "upi", UpiValidator);
            } else {
                //$('#bank_form').formValidation('removeField', "upi");
            }
    $("#save_bank, #save_and_create_bank").click(function (e) {
        if (save_flag == 0) {
            save_flag = 1
            let branchIds = "";
            let branchSelected = false;
            $("input:checkbox[name=user_front_id]:checked").each(function () {
                branchIds += $(this).val() + ",";
                branchSelected = true;
            });

            $("#branchIds").val(branchIds);

            if ($("#bankId").val() == undefined && branchSelected == false) {
                toastr.error("Please Select Mininum One Branch.");
                save_flag = 0;
                return false;
            }

            if ($('#bank_form').data('formValidation').isValid() == null) {
                $('#bank_form').data('formValidation').validate();
            }

            if ($('#bank_form').data('formValidation').isValid() == true) {
                if (e.target.id == "save_and_create_bank") {
                    $('#saveAndCreate').val(1);
                }

                $('#save_bank').prop('disabled', true);
                $('#save_and_create_bank').prop('disabled', true);

                let formData = new FormData($("#bank_form")[0]);
                // Get values from the form fields
                let creditBalance = $("#creditBalance").val() || "0";
                let debitBalance = $("#debitBalance").val() || "0";

                // Set default values to zero if they are empty
                formData.set("creditBalance", creditBalance);
                formData.set("debitBalance", debitBalance);

                $.ajax({
                    type: "POST",
                    url: "/bank/create",
                    data: formData,
                    processData: false,
                    contentType: false,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    success: function (response) {
                        if (response.status) {
                            window.location.href = response.message;
                        } else {
                            save_flag=0;
                            toastr.error('', response.message);
                        }
                        $('#save_bank').prop('disabled', false);
                        $('#save_and_create_bank').prop('disabled', false);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.status == 0) {
                            toastr.error('', 'Check Your Network.');
                        } else if (XMLHttpRequest.status == 404) {
                            toastr.error('', 'Requested URL not found.');
                        } else if (XMLHttpRequest.status == 500) {
                            toastr.error('', 'Internal Server Error.');
                        }
                        save_flag=0;
                        $('#save_bank').prop('disabled', false);
                        $('#save_and_create_bank').prop('disabled', false);
                    }
                });
            } else {
                save_flag = 0;
            }

        }

    });

     
});
 
	
	