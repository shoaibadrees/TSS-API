var Templates = new function () {
    this.List = {
        response_list: kendo.template(
            '<div class="List-View" data-object-id="${RESPONSE_ID}" data-role="touch" data-tap="onTapItem" data-hold="onHoldItem" data-swipe="onSwipeItem" data-enable-swipe= "true" >' +
                '<a class="TeamLinks">' +
                    '<div class="heading1 Section1 ${STATUS.LU_NAME}" style="line-height:1.25em;">' +
                        '<label class="status-level1"> #= getFirstChar(data.STATUS.LU_NAME) # </label> <br />' +
                        '<label class="status-level2"> ${STATUS.LU_NAME} </label>' +
                    '</div>' +
                    '<div style="width: 95%;" class="heading1">' +
                        '<label class="heading1">${COMPANY.COMPANY_NAME} </label> <br />' +
                        '<label class="heading2"> ${COMPANY.RMAG.RMAG_NAME} #= data.RESPONSE_TYPE.LOOK_UP_ID == 13 ? "Hold": "" #  DIST. #= AddCommaInNumber(checkNull(data.DISTRIBUTION, 0)) #</label>' +
                        '<label class="heading2"><br/> #= data.CALCULATION_RUN ? checkDateNull(getTimeZoneSpecificDate(data, "CALCULATION_RUN"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) : "" #</label>' +
                    '</div>' +
                    '<div><img src="images/rightarrow.png" class="RightArrow" /></div>' +
                '</a>' +
            '</div>'),

        response_detail: kendo.template(
             '<div class="lv-detail">' +
                '<div class="lv-detail-label"><img src="images/red_asterisk.png" />COMPANY RESPONDING RESOURCES</div>' +
                '<div class="lv-detail-value">${COMPANY.COMPANY_NAME}</div>' +

                '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label id="lblRMAG" ></label></div>' +
                '<div class="lv-detail-value">${COMPANY.RMAG.RMAG_NAME}</div>' +

                '<div class="lv-detail-label">RESPONSE \\/ HOLD</div>' +
                '<div class="lv-detail-value">${RESPONSE_TYPE.LU_NAME}</div>' +

                '<div class="lv-detail-label">HOLD REASON</div>' +
                '<div class="lv-detail-value">${HOLD_REASON.LU_NAME}</div>' +

                '<div class="lv-detail-label">Expected Release Date\\/Time</div>' +
                '<div class="lv-detail-value">#= checkDateNull(getTimeZoneSpecificDate(data, "RELEASE_DATE") , GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) #</div>' +

                '<div class="heading1">RESOURCE REQUESTS BY RESOURCE TYPE</div>' +
                '<div class="lv-detail-label">DISTRIBUTION</div>' +
                '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.DISTRIBUTION, "")) #</div>' +

                '<div class="lv-detail-label">TRANSMISSION</div>' +
                '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.TRANSMISSION, "")) #</div>' +

                '<div class="lv-detail-label">DAMAGE ASSESSMENT</div>' +
                '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.DAMAGE_ASSESSMENT, "")) #</div>' +

                '<div class="lv-detail-label">TREE</div>' +
                '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.TREE, "")) #</div>' +

                '<div class="lv-detail-label">SUBSTATION</div>' +
                '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.SUBSTATION, "")) #</div>' +

                '<div class="lv-detail-label">NET UG</div>' +
                '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NET_UG, "")) #</div>' +

                '<div class="lv-detail-label">OTHERS</div>' +
                '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.OTHERS, "")) #</div>' +

                '<div class="lv-detail-label">DESCRIPTION</div>' +
                '<div class="lv-detail-value">#= checkNull(data.RESOURCE_TYPE_DESCRIPTION, "") #</div>' +

                '<div class="heading1">Company Information</div>' +
                '<div class="lv-detail-label">COMPANY \\/ NON\\-COMPANY</div>' +
                '<div class="lv-detail-value">${IS_COMPANY.LU_NAME}</div>' +

                '<div class="lv-detail-label">RELEASE TO ROLL</div>' +
                '<div class="lv-detail-value">#= checkDateNull(getTimeZoneSpecificDate(data, "RELEASE_ROLE"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) #</div>' +

                '<div class="lv-detail-label">COMPANY NAME</div>' +
                '<div class="lv-detail-value">${COMPANY_NAME}</div>' +

                '<div class="lv-detail-label">CONTACT NAME</div>' +
                '<div class="lv-detail-value">${COMPANY_CONTACT}</div>' +

                '<div class="lv-detail-label">CONTACT EMAIL</div>' +
                '<div class="lv-detail-value">${COMPANY_EMAIL}</div>' +

                '<div class="lv-detail-label">CITY</div>' +
                '<div class="lv-detail-value">${COMPANY_CITY}</div>' +

                '<div class="lv-detail-label">STATE</div>' +
                '<div class="lv-detail-value">#= checkNull(data.COMPANY_STATE, "") #</div>' +

                '<div class="lv-detail-label">CLIENT PHONE \\#</div>' +
                '<div class="lv-detail-value">${COMPANY_CELLPHONE}</div>' +

                '<div class="lv-detail-label">LAST UPDATED BY</div>' +
                '<div class="lv-detail-value">${MODIFIED_BY}</div>' +

                '<div class="lv-detail-label">LAST UPDATED DATE\\/TIME</div>' +
                '<div class="lv-detail-value">#= checkDateNull(getTimeZoneSpecificDate(data, "MODIFIED_ON"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) #</div>' +

                '<div class="lv-detail-label"><img src="images/red_asterisk.png" />STATUS</div>' +
                '<div class="lv-detail-value">${STATUS.LU_NAME}</div>' +

                '<div class="lv-detail-label">CALCULATION RUN</div>' +
                '<div class="lv-detail-value">#= checkDateNull(getTimeZoneSpecificDate(data, "CALCULATION_RUN"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) #</div>' +
            '</div>'),

        response_search: kendo.template(
            '<div class="searchGroup SidePaddings">' +
                '<label class="heading2 heading4" >Event</label><br />' +
                '<input id="ddlEvents" style="width:100%" />' +
            '</div>' +
            '<div class="searchGroup SidePaddings">' +
                '<label class="heading2 heading4" >Status</label><br />' +
                '<input id="ddlStatus_search" style="width:100%" />' +
            '</div>' +
            '<div class="searchGroup SidePaddings">' + 
                '<label class="heading2 heading4" id="lblCompany">Company</label><br />' +
                '<input id="ipCompany" type="text" class="heading2" maxlength="50" />' +
            '</div>' +
            '<div class="searchGroup SidePaddings">' +
                '<label class="heading2 heading4" >Calculation Run</label><br />' +
                '<input id="ddlCalculationRun" style="width:100%" />' +
            '</div>'),

        response_step1: kendo.template(
            '<div data-step="1">' +
                '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label>COMPANY RESPONDING RESOURCES</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlResponseCompany" data-role="dropdownlist" name="CLIENT RESPONDING RESOURCES" ' +
                        'data-bind="value: responseDC.COMPANY.COMPANY_ID, source: ResponseCompanies, events:{change:onResponseCompanyChange}"' +
                        'data-text-field="COMPANY_NAME"' +
                        'data-value-field="COMPANY_ID" data-required-field="required"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label id="lblRMAGEdit" ></label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlRMAG" data-role="dropdownlist" name="RMAG" ' +
                        'data-bind="value: responseDC.COMPANY.RMAG.RMAG_ID, source:getResponseCompaniesCascadeRMAGS, events:{change:onResponseRMAGChange}"' +
                        'data-text-field="RMAG_NAME"' +
                        'data-value-field="RMAG_ID" data-required-field="required"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label>STATUS</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlStatus" data-role="dropdownlist" name="STATUS" ' +
                        'data-bind="value: responseDC.STATUS.LOOK_UP_ID, source:ResponseStatuses, events:{change:onStatusChange}"' +
                        'data-text-field="LU_NAME"' +
                        'data-value-field="LOOK_UP_ID" data-required-field="required"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><label>DESCRIPTION</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtDescription" type="text" data-bind="value:responseDC.DESCRIPTION" data-maxlength="250" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' +
                '<div class="lv-detail-label"><label>RESPONSE\\/HOLD</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlResponseType" data-role="dropdownlist" ' +
                        'data-bind="value: responseDC.RESPONSE_TYPE.LOOK_UP_ID, source:ResponseTypes, events:{change:onResponseTypeChange}"' +
                        'data-text-field="LU_NAME"' +
                        'data-value-field="LOOK_UP_ID"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><label>HOLD REASON</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlHoldReason" data-role="dropdownlist" ' +
                        'data-bind="value: responseDC.HOLD_REASON.LOOK_UP_ID, source:HoldReasons"' +
                        'data-text-field="LU_NAME"' +
                        'data-value-field="LOOK_UP_ID"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><label>EXPECTED RELEASE DATE\\/TIME</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="dtExpectedRelease" name="dtExpectedRelease" type="text" data-bind="value:responseDC.RELEASE_DATE" placeholder="MM/dd/yyyy HH:mm" '+
                    'data-rule-message="' + Globals.InvalidDateTimeMessage + '"  />' +
                '</div>' +
                '<div class="lv-detail-label"><label>COMPANY \\/ NON-COMPANY</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlCompanyNonCompany" data-role="dropdownlist" ' +
                        'data-bind="value: responseDC.IS_COMPANY.LOOK_UP_ID, source:CompanyModes, events:{change:onCompanyNonCompanyChange}"' +
                        'data-text-field="LU_NAME"' +
                        'data-value-field="LOOK_UP_ID"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><label>RELEASE TO ROLL</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="dtReleaseToRoll" name="dtReleaseToRoll" type="text" data-bind="value:responseDC.RELEASE_ROLE" placeholder="MM/dd/yyyy HH:mm" ' +
                    'data-rule-message="' + Globals.InvalidDateTimeMessage + '"  />' +
                '</div>' +
            '</div>'),

        response_step2: kendo.template(
            '<div data-step="2">' +
                '<div class="heading1" style="max-width:98%;">RESOURCE RESPONSES BY RESOURCE TYPE</div>' +
                '<div class="lv-detail-label"><label>DISTRIBUTION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericDISTRIBUTION", "responseDC.DISTRIBUTION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>TRANSMISSION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericTRANSMISSION", "responseDC.TRANSMISSION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>DAMAGE ASSESSMENT</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericDAMAGE", "responseDC.DAMAGE_ASSESSMENT") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>TREE</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericTREE", "responseDC.TREE") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>SUBSTATION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericSUBSTATION", "responseDC.SUBSTATION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>NET UG</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNET_UG", "responseDC.NET_UG") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>OTHERS</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericOTHERS", "responseDC.OTHERS") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>DESCRIPTION</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtNumericRESOURCE_TYPE_DESCRIPTION" type="text" data-bind="value:responseDC.RESOURCE_TYPE_DESCRIPTION" data-maxlength="250" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' +
            '</div>'),

        response_step3: kendo.template(
            '<div data-step="3">' +
                '<div class="heading1">COMPANY INFORMATION</div>' +
                '<div class="lv-detail-label"><label>COMPANY NAME</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_NAME" type="text" data-bind="value:responseDC.COMPANY_NAME" data-maxlength="50" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"  />' +
                '</div>' +
                '<div class="lv-detail-label"><label>CONTACT NAME</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_CONTACT" type="text" data-bind="value:responseDC.COMPANY_CONTACT" data-maxlength="60" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' +                
                '<div class="lv-detail-label"><label>CONTACT EMAIL</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_EMAIL" type="text" name="CONTACT EMAIL" data-bind="value:responseDC.COMPANY_EMAIL" data-maxlength="250" ' +
                    'data-pattern="^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$" '+
                    'data-rule-message="Please enter Contact Email in correct format." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' + 
                '<div class="lv-detail-label"><label>CITY</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_CITY" data-bind="value:responseDC.COMPANY_CITY" maxlength="40" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' + 
                '<div class="lv-detail-label"><label>STATE</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlState" data-role="dropdownlist" ' +
                        'data-bind="value: responseDC.COMPANY_STATE, source:States"' +
                        'data-text-field="ST_STATE"' +
                        'data-value-field="ST_STATE"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><label>CLIENT PHONE \\#</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_CELLPHONE" name="CLIENT PHONE \\#" data-bind="value:responseDC.COMPANY_CELLPHONE" />' +
                '</div>' + 

                '<div class="lv-detail-label" data-bind="invisible:isNew"><label>LAST UPDATED BY</label></div>' +
                '<div class="lv-detail-value" data-bind="invisible:isNew" >${responseDC.MODIFIED_BY}</div>' +

                '<div class="lv-detail-label" data-bind="invisible:isNew"><label>LAST UPDATED DATE\\/TIME</label></div>' +
                '<div class="lv-detail-value" data-bind="invisible:isNew">#= checkDateNull(getTimeZoneSpecificDate(responseDC, "MODIFIED_ON"), GetTimeZonePostFix(responseDC.EVENT_TIME_ZONE_NAME)) #</div>' +

                '<div class="lv-detail-label" data-bind="invisible:isNew"><label>CALCULATION RUN</label></div>' +
                '<div class="lv-detail-value" data-bind="invisible:isNew">#= checkDateNull(getTimeZoneSpecificDate(responseDC, "CALCULATION_RUN"), GetTimeZonePostFix(responseDC.EVENT_TIME_ZONE_NAME)) #</div>' +
            '</div>'),

        group_header: kendo.template('#= (value) ? getTimeZoneSpecificCalculationRun(value) : "No Calculation Run" #'),

        group_items: kendo.template('<li id="${data.label}" data-field="${data.field}" #= data.selected ? "class=\'Selected\'" : "" # >${data.label}</li>'),

        footer_navigation: kendo.template(
                '<div id="btnPreviousStep" data-role="button" onclick="NavigateSteps(\'pre\');">Previous</div>' +
                '<div id="btnNextStep" data-role="button" onclick="NavigateSteps(\'next\');">Next</div>'
            ),

        request_list: kendo.template(
            '<div class="List-View" data-object-id="${REQUEST_ID}" data-role="touch" data-tap="onTapItem" data-hold="onHoldItem" data-swipe="onSwipeItem" data-enable-swipe= "true" >' +
                '<a class="TeamLinks">' +
                    '<div class="heading1 Section1 ${STATUS_LU.LU_NAME}" style="line-height:1.25em;">' +
                        '<label class="status-level1"> #= getFirstChar(data.STATUS_LU.LU_NAME) # </label> <br />' +
                        '<label class="status-level2"> ${STATUS_LU.LU_NAME} </label>' +
                    '</div>' +
                    '<div style="width: 95%;" class="heading1">' +
                        '<label class="heading1"> ${COMPANY.COMPANY_NAME} </label> <br />' +
                        '<label class="heading2"> ${COMPANY.RMAG.RMAG_NAME} DIST. #= AddCommaInNumber(checkNull(data.DISTRIBUTION, 0)) #</label>' +
                        '<label class="heading2"><br/> #= data.CALCULATION_RUN ? checkDateNull(getTimeZoneSpecificDate(data, "CALCULATION_RUN"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) : "" #</label>' +
                    '</div>' +
                    '<div><img src="images/rightarrow.png" class="RightArrow" /></div>' +
                '</a>' +
            '</div>'),

        request_detail: kendo.template(
            '<div class="lv-detail">' +
               '<div class="lv-detail-label"><img src="images/red_asterisk.png" />COMPANY REQUESTING RESOURCES</div>' +
               '<div class="lv-detail-value">${COMPANY.COMPANY_NAME}</div>' +

               '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label id="lblRMAG" ></label></div>' +
               '<div class="lv-detail-value">${COMPANY.RMAG.RMAG_NAME}</div>' +

               '<div class="lv-detail-label">CUSTOMER OUTAGES</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.CUSTOMER_OUTAGES, "")) # </div>' +

               '<div class="lv-detail-label">CASES OF TROUBLE</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.TROUBLE_CASES, "")) # </div>' +

               '<div class="lv-detail-label">LATEST TARGET ARRIVAL DATE\\/TIME</div>' +
               '<div class="lv-detail-value">#= checkDateNull(getTimeZoneSpecificDate(data, "LATEST_TARGET_ARRIVAL"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) #</div>' +

               '<div class="heading1">RESOURCE REQUESTS BY RESOURCE TYPE</div>' +
               '<div class="lv-detail-label">DISTRIBUTION</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.DISTRIBUTION, "")) # </div>' +

               '<div class="lv-detail-label">TRANSMISSION</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.TRANSMISSION, "")) # </div>' +

               '<div class="lv-detail-label">DAMAGE ASSESSMENT</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.DAMAGE_ASSESSMENT, "")) # </div>' +

               '<div class="lv-detail-label">TREE</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.TREE, "")) # </div>' +

               '<div class="lv-detail-label">SUBSTATION</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.SUBSTATION, "")) # </div>' +

               '<div class="lv-detail-label">NET UG</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NET_UG, "")) # </div>' +

               '<div class="heading1">NON-NATIVE FTE RESOURCES ACQUIRED</div>' +
               '<div class="lv-detail-label">DISTRIBUTION</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NON_NATIVE_DISTRIBUTION, "")) # </div>' +

               '<div class="lv-detail-label">TRANSMISSION</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NON_NATIVE_TRANSMISSION, "")) # </div>' +

               '<div class="lv-detail-label">DAMAGE ASSESSMENT</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NON_NATIVE_DAMAGE_ASSESSMENT, "")) # </div>' +

               '<div class="lv-detail-label">TREE</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NON_NATIVE_TREE, "")) # </div>' +

               '<div class="lv-detail-label">SUBSTATION</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NON_NATIVE_SUBSTATION, "")) # </div>' +

               '<div class="lv-detail-label">NET UG</div>' +
               '<div class="lv-detail-value">#= AddCommaInNumber(checkNull(data.NON_NATIVE_NET_UG, "")) # </div>' +

               '<div class="heading1">Company Information</div>' +
               '<div class="lv-detail-label">CONTACT NAME</div>' +
               '<div class="lv-detail-value">${COMPANY_CONTACT}</div>' +

               '<div class="lv-detail-label">CONTACT EMAIL</div>' +
               '<div class="lv-detail-value">${COMPANY_EMAIL}</div>' +

               '<div class="lv-detail-label">CITY</div>' +
               '<div class="lv-detail-value">${COMPANY_CITY}</div>' +

               '<div class="lv-detail-label">STATE</div>' +
               '<div class="lv-detail-value">#= checkNull(data.COMPANY_STATE, "") #</div>' +

               '<div class="lv-detail-label">CLIENT PHONE \\#</div>' +
               '<div class="lv-detail-value">${COMPANY_CELLPHONE}</div>' +

               '<div class="lv-detail-label">LAST UPDATED BY</div>' +
               '<div class="lv-detail-value">${MODIFIED_BY}</div>' +

               '<div class="lv-detail-label">LAST UPDATED DATE\\/TIME</div>' +
               '<div class="lv-detail-value">#= checkDateNull(getTimeZoneSpecificDate(data, "MODIFIED_ON"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) #</div>' +

               '<div class="lv-detail-label"><img src="images/red_asterisk.png" />STATUS</div>' +
               '<div class="lv-detail-value">${STATUS_LU.LU_NAME}</div>' +

               '<div class="lv-detail-label">CALCULATION RUN</div>' +
               '<div class="lv-detail-value">#= checkDateNull(getTimeZoneSpecificDate(data, "CALCULATION_RUN"), GetTimeZonePostFix(data.EVENT_TIME_ZONE_NAME)) #</div>' +
           '</div>'),

        request_step1: kendo.template(
            '<div data-step="1">' +
                '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label>COMPANY REQUESTING RESOURCES</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlRequestCompany" data-role="dropdownlist" name="CLIENT REQUESTING RESOURCES" ' +
                        'data-bind="value: requestDC.COMPANY.COMPANY_ID, source: RequestCompanies, events:{change:onRequestCompanyChange}"' +
                        'data-text-field="COMPANY_NAME"' +
                        'data-value-field="COMPANY_ID" data-required-field="required"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label id="lblRMAGEdit" ></label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlRMAG" data-role="dropdownlist" name="RMAG" ' +
                        'data-bind="value: requestDC.COMPANY.RMAG.RMAG_ID, source:getRequestCompaniesCascadeRMAGS, events:{change:onRequestRMAGChange}"' +
                        'data-text-field="RMAG_NAME"' +
                        'data-value-field="RMAG_ID" data-required-field="required"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><img src="images/red_asterisk.png" /><label>STATUS</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlStatus" data-role="dropdownlist" name="STATUS" ' +
                        'data-bind="value: requestDC.STATUS_LU.LOOK_UP_ID, source:RequestStatuses, events:{change:onStatusChange} "' +
                        'data-text-field="LU_NAME"' +
                        'data-value-field="LOOK_UP_ID" data-required-field="required"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><label>CUSTOMER OUTAGES</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericCUSTOMER_OUTAGES", "requestDC.CUSTOMER_OUTAGES") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>CASES OF TROUBLE</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericTROUBLE_CASES", "requestDC.TROUBLE_CASES") #' +
                '</div>' +
                 '<div class="lv-detail-label"><label>LATEST TARGET ARRIVAL DATE/TIME</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="dtLatestTargetArrival" name="dtLatestTargetArrival" type="text" data-bind="value:requestDC.LATEST_TARGET_ARRIVAL" placeholder="MM/dd/yyyy HH:mm" ' +
                    'data-rule-message="' + Globals.InvalidDateTimeMessage + '"  />' +
                '</div>' +
            '</div>'),

        request_step2: kendo.template(
            '<div data-step="2">' +
                '<div class="heading1" style="max-width:98%;">RESOURCE REQUESTS BY RESOURCE TYPE</div>' +
                '<div class="lv-detail-label"><label>DISTRIBUTION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericDISTRIBUTION", "requestDC.DISTRIBUTION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>TRANSMISSION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericTRANSMISSION", "requestDC.TRANSMISSION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>DAMAGE ASSESSMENT</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericDAMAGE", "requestDC.DAMAGE_ASSESSMENT") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>TREE</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericTREE", "requestDC.TREE") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>SUBSTATION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericSUBSTATION", "requestDC.SUBSTATION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>NET UG</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNET_UG", "requestDC.NET_UG") #' +
                '</div>' +
            '</div>'),

        request_step3: kendo.template(
            '<div data-step="3">' +
                '<div class="heading1" style="max-width:98%;">NON-NATIVE FTE RESOURCES ACQUIRED</div>' +
                '<div class="lv-detail-label"><label>DISTRIBUTION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNON_NATIVE_DISTRIBUTION", "requestDC.NON_NATIVE_DISTRIBUTION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>TRANSMISSION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNON_NATIVE_TRANSMISSION", "requestDC.NON_NATIVE_TRANSMISSION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>DAMAGE ASSESSMENT</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNON_NATIVE_DAMAGE", "requestDC.NON_NATIVE_DAMAGE_ASSESSMENT") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>TREE</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNON_NATIVE_TREE", "requestDC.NON_NATIVE_TREE") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>SUBSTATION</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNON_NATIVE_SUBSTATION", "requestDC.NON_NATIVE_SUBSTATION") #' +
                '</div>' +
                '<div class="lv-detail-label"><label>NET UG</label></div>' +
                '<div class="lv-detail-value">' +
                    '#= Templates.getNumericTextBox("txtNumericNON_NATIVE_NET_UG", "requestDC.NON_NATIVE_NET_UG") #' +
                '</div>' +
            '</div>'),
        request_step4: kendo.template(
            '<div data-step="4">' +
                '<div class="heading1">COMPANY INFORMATION</div>' +
                '<div class="lv-detail-label"><label>CONTACT NAME</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_CONTACT" data-bind="value:requestDC.COMPANY_CONTACT" data-maxlength="60" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' +
                '<div class="lv-detail-label"><label>CONTACT EMAIL</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_EMAIL" name="CONTACT EMAIL" data-bind="value:requestDC.COMPANY_EMAIL" data-maxlength="250" ' +
                    'data-pattern="^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$" ' +
                    'data-rule-message="Please enter Contact Email in correct format." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' +
                '<div class="lv-detail-label"><label>CITY</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_CITY" data-bind="value:requestDC.COMPANY_CITY" data-maxlength="40" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                '</div>' +
                '<div class="lv-detail-label"><label>STATE</label></div>' +
                '<div class="lv-detail-value">' +
                    '<select id="ddlState" data-role="dropdownlist" ' +
                        'data-bind="value: requestDC.COMPANY_STATE, source:States"' +
                        'data-text-field="ST_STATE"' +
                        'data-value-field="ST_STATE"></select>' +
                '</div>' +
                '<div class="lv-detail-label"><label>CLIENT PHONE \\#</label></div>' +
                '<div class="lv-detail-value">' +
                    '<input id="txtCOMPANY_CELLPHONE" name="CLIENT PHONE \\#" data-bind="value:requestDC.COMPANY_CELLPHONE" />' +
                '</div>' +
                '<div class="heading1" data-bind="invisible:isNew">Others</div>' +
                '<div class="lv-detail-label" data-bind="invisible:isNew"><label>LAST UPDATED BY</label></div>' +
                '<div class="lv-detail-value" data-bind="invisible:isNew" >${requestDC.MODIFIED_BY}</div>' +
                '<div class="lv-detail-label" data-bind="invisible:isNew"><label>LAST UPDATED DATE\\/TIME</label></div>' +
                '<div class="lv-detail-value" data-bind="invisible:isNew">#= getTimeZoneSpecificDate(requestDC, "MODIFIED_ON") # #= GetTimeZonePostFix(requestDC.EVENT_TIME_ZONE_NAME) #</div>' +
                '<div class="lv-detail-label" data-bind="invisible:isNew"><label>CALCULATION RUN</label></div>' +
                '<div class="lv-detail-value" data-bind="invisible:isNew">#= getTimeZoneSpecificDate(requestDC, "CALCULATION_RUN") # #= GetTimeZonePostFix(requestDC.EVENT_TIME_ZONE_NAME) #</div>' +
            '</div>')
    };

    this.getByName = function (name) {
        return this.List[name];
    }

    this.getNumericTextBox = function (id, valueField) {
        //-- Android - chrome - (keycode/keychar/which) alwasy 0, decimal point key not handling, when adding comman error occured 'the specified vlaue is not valid number', maxlength attr. not applying
        var template = '';
        ////if (/Android/.test(Globals.UserAgent))
        ////    template = '<input id="' + id + '" type="number" data-bind="value:' + valueField + '" min="0"  max="9999999999" inputmode="numeric" pattern="[0-9]*" title="Only number between 0-9999999999" data-maxlength="10" onkeyup="onNumericTextBoxKeyUp(this);"  onblur="onNumericTextBoxBlur(this);" onfocus="onNumericTextBoxFocus(this);" />';
        ////else if (/iPhone/.test(Globals.UserAgent))
        template = '<input id="' + id + '" type="text" data-bind="value:' + valueField + '" inputmode="numeric" pattern="[0-9]*" data-maxlength="10"  onkeyup="onNumericTextBoxKeyUp(this);" onblur="onNumericTextBoxBlur(this);" onfocus="onNumericTextBoxFocus(this);" />';

        return template;
    };
};