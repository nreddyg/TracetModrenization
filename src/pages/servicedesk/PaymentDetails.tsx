

import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Home, Save, RotateCcw } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, } from '@/components/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { SUBSCRIPTION_PAYMENT_DB } from '@/Local_DB/Form_JSON_Data/SubscriptionDB';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { addSubscription, getAddChequeList, getNextAmcFromDate, getSubscriptionById, getSubscriptionCurrency, getUpdateChequeList, updateSubscription } from '@/services/subscriptionServices';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/projectsSlice';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useMessage } from '@/components/ui/reusable-message';
import { useAppSelector } from '@/store';

const PaymentDetails = () => {
  const companyId=useAppSelector(state=>state.projects.companyId)
  const [fields, setFields] = useState<BaseField[]>(SUBSCRIPTION_PAYMENT_DB);
  const dispatch = useDispatch();
  const location = useLocation();
  const subData = location.state.subscriptionData ? location.state?.subscriptionData : null
  console.log(subData,"subData")
  const customerName = location.state.parentData?.CustomerName;
  console.log(customerName,"customerName")
  const productname = location.state.parentData?.ProductName;
  const message=useMessage();
  const navigate=useNavigate();

  // Date calculation function similar to the second code
  const getDateAfterYears = (date: any, year: string): string => {
    let months = (year === "Monthly") ? 1 : (year === "Quarterly") ? 3 : (year === "Half Yearly") ? 6 : (year === "Yearly") ? 12 : 0;
    
    // Handle different date formats - convert to consistent format
    let inputDate: Date;
    
    // Check if date is already a Date object
    if (date instanceof Date) {
      inputDate = date;
    } 
    // Check if date is a string
    else if (typeof date === 'string') {
      if (date.includes('/')) {
        // DD/MM/YYYY format
        const inputDateParts = date.split('/');
        inputDate = new Date(`${inputDateParts[2]}-${inputDateParts[1]}-${inputDateParts[0]}`);
      } else if (date.includes('-')) {
        // YYYY-MM-DD format
        inputDate = new Date(date);
      } else {
        inputDate = new Date(date);
      }
    }
    // Handle any other format by trying to convert to Date
    else {
      inputDate = new Date(date);
    }
    
    // Validate the date
    if (isNaN(inputDate.getTime())) {
      console.error('Invalid date provided:', date);
      return '';
    }
    
    const futureDate = new Date(inputDate.getFullYear(), inputDate.getMonth() + months, inputDate.getDate());
    const previousDay = new Date(futureDate.getTime() - 24 * 60 * 60 * 1000);
    
    // Return in DD/MM/YYYY format to match the expected format
    return `${previousDay.getDate().toString().padStart(2, '0')}/${(previousDay.getMonth() + 1).toString().padStart(2, '0')}/${previousDay.getFullYear()}`;
  };

  // Function to calculate and update AMCToDate
  const calculateAMCToDate = (amcFromDate: string, type: string) => {
    if (amcFromDate && type) {
      const calculatedDate = getDateAfterYears(amcFromDate, type);
      setValue("AMCToDate", calculatedDate, { shouldValidate: true });
    } else {
      setValue("AMCToDate", "", { shouldValidate: true });
    }
  };

  const handleSubmitForm = async (data: GenericObject): Promise<void> => {
    dispatch(setLoading(true));
    try {
      const pay = {
        "SubscriptionsDetails": subData
          ? [
            {
              AMCExpiryDate: data.AMCExpiryDate,
              Amount: data.Amount,
              BankName: data.BankName,
              ChequeDate: data.ChequeDate,
              ChequeNo: data.ChequeNo,
              Currency: data.Currency?.toString(),
              CurrencyAmount: data.CurrencyAmount,
              NoofAPICalls: data.NoOfCountDetails?.toString() || 0,
              OrderValue: data.OrderValue,
              OverUsageAPIcalls: data.OverUsageCount?.toString() || 0,
              PaymentMode: data.PaymentDetails ,
              PerAPIcost: data.PerAdditionalCountCost || 0 ,
              Remark: data.Remark,
              TDSAmount: "",
            },
          ]
          : [
            {
              "CustomerName": data.CustomerName,
              "ProductName": data.ProductName,
              "OrderValue": data.OrderValue || "0",
              "PaymentMode": data.PaymentDetails,
              "BankName": data.BankName,
              "ChequeNo": data.ChequeNo,
              "ChequeDate": data.ChequeDate,
              "Amount": data.Amount,
              "TDSAmount": "",
              "Type": data.Type,
              "AMCFromDate":data.AMCFromDate,
              "AMCToDate": data.AMCToDate,
              "AMCPaidDate": data.AMCPaidDate,
              "AMCExpiryDate": data.AMCExpiryDate,
              "Currency": data.Currency?.toString(),
              "CurrencyAmount": data.CurrencyAmount,
              "NoofAPICalls": data.NoOfCountDetails?.toString() || 0,
              "PerAPIcost": data.PerAdditionalCountCost || 0,
              "OverUsageAPIcalls": data.OverUsageCount?.toString() || 0,
              "Remark": data.Remark,
            },
          ],
      };
      const paymentMode = data.PaymentDetails;
      const chequeNo = data.ChequeNo;
      if (paymentMode === "Cheque") {
        if (!chequeNo || chequeNo.length < 6) {
          message.error("Minimum Cheque Number Should be 6 Characters!!");
          return;
        }

        if (subData) {
          // 🔹 Update case
          const res = await getUpdateChequeList(chequeNo, subData?.SubscriptionId, companyId);
          if (res.data?.status === true) {
            message.error('Cheque No. Already Exists');
            return;
          } else {
          const res=  await updateSubscription("All", companyId, subData?.SubscriptionId, subData?.CustomerName, subData?.ProductName, pay);
         if(res?.success && res.data){
          if(res.data.status===true){
            message.success(res.data.message)
            handleClear();
            navigate(-1);
          }
          else{
            message.error(res.data.message)
          }
         }
          }
        } else {
          // 🔹 Add case
          const res = await getAddChequeList(chequeNo, companyId);
          if (res.data?.status === true) {
            message.error('Cheque No. Already exists');
            return;
          } else {
          const res=  await addSubscription("All", companyId, pay);
             if(res?.success && res.data){
          if(res.data.status===true){
            message.success(res.data.message)
            handleClear();
            navigate(-1);
          }
          else{
            message.error(res.data.message)
          }
         }
          }
        }
      } else {
        let res;
        if (subData) {
       res= await updateSubscription("All", companyId, subData?.SubscriptionId, subData?.CustomerName, subData?.ProductName, pay);
        } else {
         res= await addSubscription("All", companyId, pay);
        }
       if(res?.success && res.data){
        if(res.data.status===true){
          message.success(res.data.message)
          handleClear();
          navigate(-1);
        }  
        else{
          message.error(res.data.message)
        }     
       }
      }
    } catch (error) {
      message.error("Failed to save subscription");
    } finally {
      dispatch(setLoading(false));
    }
  };


  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? ''
      return acc;
    }, {} as GenericObject),

  });
  const { control, register, handleSubmit, trigger, watch, setValue,getValues, reset, formState: { errors } } = form;

  // Watch for changes in AMCFromDate, Type, AMCToDate, and Amount
  const watchAMCFromDate = watch("AMCFromDate");
  const watchType = watch("Type");
  const watchAMCToDate = watch("AMCToDate");
  const watchAmount = watch("Amount");

    // Effect to handle automatic AMCToDate calculation
  useEffect(() => {
    if (watchAMCFromDate && watchType) {
      calculateAMCToDate(watchAMCFromDate, watchType);
    }
  }, [watchAMCFromDate, watchType]);

  // Effect to handle automatic AMCExpiryDate setting
  useEffect(() => {
    if (watchAMCToDate) {
      setValue("AMCExpiryDate", watchAMCToDate, { shouldValidate: true });
    }
  }, [watchAMCToDate, setValue]);

  // Effect to sync Amount with CurrencyAmount
  useEffect(() => {
    if (watchAmount) {
      setValue("CurrencyAmount", watchAmount, { shouldValidate: true });
    }
  }, [watchAmount, setValue]);

  const handleClear = () => {
    form.reset();
  };

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show) return null;
    const validationRules = {
      required: isRequired ? `${label} is required` : false,
    };
    switch (fieldType) {
      case 'text':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'dropdown':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDropdown
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDatePicker
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      default:
        return null;
    }
  };
  // Helper function to get fields by names (similar to TicketView)
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));
  
  //getCurrency
  async function getCurrency() {
    dispatch(setLoading(true));
    await getSubscriptionCurrency()
      .then((res) => {
        if (res.success && res.data) {
          const lookup = res.data.Currency || [];
          if (lookup.length > 0) {
            const options = lookup.map((user: any) => ({
              label: user.Text,
              value: user.Value,
            }));
            setFields((prevFields) =>
              prevFields.map((f) =>
                f.name === "Currency" ? { ...f, options } : f
              )
            );
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching currency lookup:", err);
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }
  async function getNextAMCDate(customerName: string, productname: string, branchname: string, compid: number) {
    dispatch(setLoading(true));
    await getNextAmcFromDate(customerName, productname, branchname, compid)
      .then((res) => {
        if (res.success && res.data) {
          const temp = res.data[0];
          const value = temp?.StartDate?.split(" ")[0]
          const ordervalue = temp?.OrderValue;
          setFields((prevFields) =>
            prevFields.map((f) => {
              if (f.name === "AMCFromDate") {
                return { ...f, defaultValue: value, disabled: value?true:false };
              }
              if (f.name === "OrderValue") {
                return { ...f, defaultValue: ordervalue, disabled: temp?.OrderValue > 0 };
              }
              return f;
            })
          );
          if (value) setValue("AMCFromDate", value, { shouldValidate: true });
          if (ordervalue) setValue("OrderValue", ordervalue, { shouldValidate: true });
        }
      })
      .catch((err) => {
        console.error("Error fetching:", err);
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }
  useEffect(() => {
    getCurrency();
    if (subData === null && companyId) {
      getNextAMCDate(customerName, productname, 'All', companyId);
    }
  }, [companyId])
  const paymentMode = watch("PaymentDetails");
  const getPaymentFields = () => {
    switch (paymentMode) {
      case "Cheque":
        return ["PaymentDetails", "BankName", "ChequeNo", "ChequeDate", "Amount", "Currency", "CurrencyAmount"];
      case "Cash":
        return ["PaymentDetails", "Amount", "Currency", "CurrencyAmount"];
      case "NEFT":
        return ["PaymentDetails", "BankName", "Amount", "Currency", "CurrencyAmount"];
      default:
        return ["PaymentDetails"]; 
    }
  };

  useEffect(() => {
    if (customerName || productname) {
      if (customerName) setValue("CustomerName", customerName, { shouldValidate: true });
      if (productname) setValue("ProductName", productname, { shouldValidate: true });
      setFields((prev) =>
        prev.map((f) => {
          if (f.name === "CustomerName") {
            return { ...f, defaultValue: customerName, disabled: true };
          }
          if (f.name === "ProductName") {
            return { ...f, defaultValue: productname, disabled: true };
          }
          return f;
        })
      );
    }
  }, [customerName, productname, setValue]);

  //subscription By Id

  async function getsubscriptionById(id: number, compid: number) {
    dispatch(setLoading(true))
    await getSubscriptionById(id, compid).then(res => {
      if (res.success && res.data) {
        const details = res.data.SubscriptionDetails;
        if (details) {
          reset({
            CustomerName: details.CustomerName,
            ProductName: details.ProductName,
            OrderValue: details.OrderValue,
            PaymentDetails: details.PaymentDetails,
            BankName: details.BankName,
            ChequeNo: details.ChequeNo,
            ChequeDate: details.ChequeDate,
            Amount: details.Amount,
            Currency: details.Currency,
            CurrencyAmount: details.CurrencyAmount,
            Type: details.Type,
            AMCFromDate:details.AMCFromDate,
            AMCToDate: details.AMCToDate,
            AMCPaidDate: details.AMCPaidDate,
            AMCExpiryDate: details.AMCExpiryDate,
            NoOfCountDetails: details.NoOfCountDetails,
            PerAdditionalCountCost: details.PerAdditionalCountCost,
            OverUsageCount: details.OverUsageCount,
            Remark: details.Remark
          });
        }
      }
    })
      .catch(err => {
        console.error('Error fetching subscription by customer:', err);
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }

  useEffect(() => {
    if (subData && companyId) {
      getsubscriptionById(subData?.SubscriptionId, companyId)
      setFields((prev) =>
        prev.map((f) => {
          if (f.name === "Type" || f.name === 'AMCFromDate' || f.name === 'AMCToDate' || f.name === 'AMCPaidDate' || f.name === 'CustomerName' || f.name === 'ProductName') {
            return { ...f, disabled: true };
          }
          if (f.name === 'OrderValue' && parseFloat(getValues('OrderValue'))) {
            return { ...f, disabled: true }
          }
          return f;
        })
      );
    }
    if(subData && subData?.SubscriptionStatus==='Expired'){
      setFields((prev) =>
        prev.map((f) => {
          if (f.name === "PaymentDetails" || f.name==='BankName' || f.name==='ChequeNo' || f.name==='ChequeDate' || f.name==='Amount' ) {
            return { ...f, disabled: true };
          }
           if(f.name==='OrderValue' && parseFloat(getValues('OrderValue'))){
            return {...f,disabled:true}
          }
          return f;
        })
      ); 
    }
  }, [subData?.SubscriptionId,companyId])


  return (
    <div className=" bg-gray-50/30 h-full overflow-y-scroll" >
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <Link to="/service-desk" className="hover:text-blue-600 transition-colors">Service Desk</Link>
            <span>/</span>
            <Link to="/service-desk/subscription" className="hover:text-blue-600 transition-colors">Subscription</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Payment Details</span>
          </nav>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600 mt-1">Manage subscription payment information</p>
         {subData &&   <p className=" font-bold text-gray-900">Subscription Status:<span className={subData.SubscriptionStatus==='Expired'?'text-red-500':'text-green-500'}>{subData.SubscriptionStatus}</span></p>}
          </div>
        </div>
        {/* Payment Form */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getFieldsByNames(['CustomerName', 'ProductName', 'OrderValue']).map((field) => (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
                {/* Payment Section */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-orange-600 font-semibold mb-4">Payment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getFieldsByNames(getPaymentFields()).map((field) => (
                      <div key={field.name} className={field.name==='ChequeDate' ? "mt-1" : "mt-0"}>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Subscription Details */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-orange-600 font-semibold mb-4">Subscription Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getFieldsByNames(['Type', 'AMCFromDate', 'AMCToDate', 'AMCPaidDate', 'AMCExpiryDate']).map((field) => (
                      <div key={field.name}>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
                {/* API Details */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-orange-600 font-semibold mb-4">API Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getFieldsByNames(['NoOfCountDetails', 'PerAdditionalCountCost', 'OverUsageCount', 'Remark']).map((field) => (
                      <div key={field.name}>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <ReusableButton
                    htmlType="submit"
                    variant="default"
                    className="bg-orange-500 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600"
                    icon={<Save className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    {subData?'Update':'Save'}
                  </ReusableButton>
                  <ReusableButton
                    htmlType="button"
                    variant="default"
                    onClick={handleClear}
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    icon={<RotateCcw className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Cancel
                  </ReusableButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDetails;