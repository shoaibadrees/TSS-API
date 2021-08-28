angular.module('HylanApp').factory("CompaniesService", ['DataContext',

    function (DataContext) {
        var resource = "Companies";
        var schema = {
            model: {
                id: "COMPANY_ID",
                fields: {
                    ROW_HEADER: { editable: false },
                    COMPANY_ID: {},
                    COMPANY_NAME: {
                        title: "Client Name", locked: true, validation: {
                            companynamemaxlength: function (input) {
                                if (input.val().length > 50) {
                                    input.attr("data-companynamemaxlength-msg", "Max. length for Client Name is 50.");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    TOTAL_CUSTOMERS: {
                        defaultValue: '',
                        type: "number",
                        title: "Total Customers", validation: {
                            totalcustomersvalidation: function (input) {
                        if (input.is("[name='TOTAL_CUSTOMERS']") && input.val() != "") {
                            input.attr("data-totalcustomersvalidation-msg", "Enter only ten digits.");
                            return /^[0-9]{1,10}$/.test(input.val());
                        }
                        return true;
                    }
    }
                    },
                    //RMAG: {
                    //    title: "Home Rmag", defaultValue: { RMAG_NAME: "" },
                    //    editable: true
                    //},
                    //HOME_RMAG: {
                       
                    //},
                    //RMAGS: {
                    //},
                    //RMAGS_NAMES: {
                    //},
                    COMPANY_PHONE_NUMBER: {
                        title: "Client Contact Number", validation: {
                            companycontactnumbervalidation: function (input) {
                                if (input.is("[name='COMPANY_PHONE_NUMBER']") && input.val() != "") {
                                    input.attr("data-companycontactnumbervalidation-msg", "Enter at least ten digits.");
                                    return /\d{10}/.test(input.val());
                                }
                                return true;
                            }
                        }
                    },
                    PRIMARY_CONTACT_NAME: {
                        title: "Primary Contract Name", validation: {
                            primarycontactnamemaxlength: function (input) {
                                if (input.val().length > 60) {
                                    input.attr("data-primarycontactnamemaxlength-msg", "Max. length for Primary Contract Name is 60.");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    PRIMARY_CONTACT_EMAIL: {
                        title: "Primary Contact Email", validation: {
                         //   email: { message: "Please enter Email in correct format." },
                            primarycontactemailmaxlength: function (input) {
                                if (input.val().length > 250) {
                                    input.attr("data-primarycontactemailmaxlength-msg", "Max. length for Primary Contract Email is 250.");
                                    return false;
                                }
                               
                                return true;
                            },

                            primarycontactemailformat: function (input) {
           
                                if (input.is("[name='PRIMARY_CONTACT_EMAIL']") && input.val() != "") {
                                    input.attr("data-primarycontactemailformat-msg", "Please enter Email in correct format.");                                    
                                    return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(input.val().toLowerCase());
                                }
                                return true;
                            }

                        }
                    },
                    COMPANY_CITY: {
                        title: "City", validation: {
                            citymaxlength: function (input) {
                                if (input.val().length > 40) {
                                    input.attr("data-citymaxlength-msg", "Max. length for City is 40.");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    COMPANY_STATE: {
                        title: "State", defaultValue: ''
                    },
                    COMPANY_ZIP: {
                        title: "Zip", validation: {
                            companyzipvalidation: function (input) {
                                if (input.is("[name='COMPANY_ZIP']") && input.val() != "" && !(/^[0-9]*$/.test(input.val()))) {
                                    input.attr("data-companyzipvalidation-msg", "Enter numeric data only.");
                                    return /^[0-9]*$/.test(input.val());
                                }
                                return true;
                            },
                            zipmaxlength: function (input) {
                                if (input.val().length > 5) {
                                    input.attr("data-zipmaxlength-msg", " Max. length for Zip is 5.");
                                    return false;
                                }
                                return true;
                            }


                        }
                    },
                    COMPANY_ADDRESS: {
                        title: "Address", validation: {
                            citymaxlength: function (input) {
                                if (input.val().length > 250) {
                                    input.attr("data-citymaxlength-msg", "Max. length for Address is 250.");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    BILLING_CONTACT_NAME: {
                        title: "Billing Contact Name", validation: {
                            billingcontactnamemaxlength: function (input) {
                                if (input.val().length > 30) {
                                    input.attr("data-billingcontactnamemaxlength-msg", "Max. length for Billing Contact Name is 30.");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    BILLING_PHONE: {
                        title: "Billing Phone Number", validation: {
                            billingphonenumbervalidation: function (input) {
                                if (input.is("[name='BILLING_PHONE']") && input.val() != "") {
                                    input.attr("data-billingphonenumbervalidation-msg", "Enter at least ten digits.");
                                    return /\d{10}/.test(input.val());
                                }
                                return true;
                            }
                        }
                    },
                    BILLING_CONTACT_EMAIL: {
                        title: "Billing Contact Email", validation: {
                            //   email: { message: "Please enter Email in correct format." },
                            billingcontactemailmaxlength: function (input) {
                                if (input.val().length > 250) {
                                    input.attr("data-billingcontactemailmaxlength-msg", "Max. length for Billing Contact Email is 250.");
                                    return false;
                                }

                                return true;
                            },

                            billingcontactemailformat: function (input) {

                                if (input.is("[name='BILLING_CONTACT_EMAIL']") && input.val() != "") {
                                    input.attr("data-billingcontactemailformat-msg", "Please enter Email in correct format.");                                    
                                    return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(input.val().toLowerCase());
                                }
                                return true;
                            }

                        }
                    },
                    PROJECT_DIRECTOR_NAME: {
                        title: "Project Director Name", validation: {
                            projectdirectornamemaxlength: function (input) {
                                if (input.val().length > 30) {
                                    input.attr("data-projectdirectornamemaxlength-msg", "Max. length for Billing Contact Name is 30.");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    PROJECT_DIRECTOR_PHONE: {
                        title: "Project Director Phone", validation: {
                            projectdirectorphonevalidation: function (input) {
                                if (input.is("[name='PROJECT_DIRECTOR_PHONE']") && input.val() != "") {
                                    input.attr("data-projectdirectorphonevalidation-msg", "Enter at least ten digits.");
                                    return /\d{10}/.test(input.val());
                                }
                                return true;
                            }
                        }
                    },
                    PROJECT_DIRECTOR_EMAIL: {
                        title: "Project Director Email", validation: {
                            //   email: { message: "Please enter Email in correct format." },
                            projectdirectoremailmaxlength: function (input) {
                                if (input.val().length > 250) {
                                    input.attr("data-projectdirectoremailmaxlength-msg", "Max. length for Project Director Email is 250.");
                                    return false;
                                }

                                return true;
                            },

                            projectdirectoremailformat: function (input) {

                                if (input.is("[name='PROJECT_DIRECTOR_EMAIL']") && input.val() != "") {
                                    input.attr("data-projectdirectoremailformat-msg", "Please enter Email in correct format.");
                                    return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(input.val().toLowerCase());
                                }
                                return true;
                            }

                        }
                    },
                    PROJECT_MANAGER_NAME: {
                        title: "Project Manager Name", validation: {
                            projectmanagernamemaxlength: function (input) {
                                if (input.val().length > 30) {
                                    input.attr("data-projectmanagernamemaxlength-msg", "Max. length for Billing Contact Name is 30.");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    PROJECT_MANAGER_PHONE: {
                        title: "Project Manager Phone", validation: {
                            projectmanagerphonevalidation: function (input) {
                                if (input.is("[name='PROJECT_MANAGER_PHONE']") && input.val() != "") {
                                    input.attr("data-projectmanagerphonevalidation-msg", "Enter at least ten digits.");
                                    return /\d{10}/.test(input.val());
                                }
                                return true;
                            }
                        }
                    },
                    PROJECT_MANAGER_EMAIL: {
                        title: "Project Manager Email", validation: {
                            //   email: { message: "Please enter Email in correct format." },
                            projectmanageremailmaxlength: function (input) {
                                if (input.val().length > 250) {
                                    input.attr("data-projectmanageremailmaxlength-msg", "Max. length for Project Manager Email is 250.");
                                    return false;
                                }

                                return true;
                            },

                            projectmanageremailformat: function (input) {

                                if (input.is("[name='PROJECT_MANAGER_EMAIL']") && input.val() != "") {
                                    input.attr("data-projectmanageremailformat-msg", "Please enter Email in correct format.");
                                    return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(input.val().toLowerCase());
                                }
                                return true;
                            }

                        }
                    },
                    STATUS: {
                        title: "Status", editable: false, defaultValue: 'Y'
                    },
                    CREATED_ON: {},
                    CREATED_BY: {},
                    MODIFIED_ON: {},
                    MODIFIED_BY: {},
                    LOCK_COUNTER:{},
                    UpdatedFields: {}
                }
            }
        };

        var defaultSort = {
            field: "COMPANY_NAME",
            dir: "asc"
        };

        var datasource = DataContext.CreateDataSource(resource, schema, null, null, null, defaultSort);
        //var GetRmags = function () {
        //    var api = "Rmag/GetAll";
        //    return Globals.Get(api, null, false);
        //};

        var GetStates = function () {
            var api = "States/GetAll";
            return Globals.Get(api, null, false);
        };

        return {
            dataSource: datasource,
            //GetRmags: GetRmags,
            GetStates: GetStates,
            defaultSort: defaultSort
        };

    }]);

