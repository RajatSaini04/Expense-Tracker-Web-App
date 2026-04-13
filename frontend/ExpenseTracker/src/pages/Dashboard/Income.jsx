// import React, { useEffect, useState } from "react";
// import DashboardLayout from "../../components/layouts/DashboardLayout";
// import IncomeOverview from "../../components/Income/IncomeOverview"
// import axiosInstance from "../../utils/axiosInstance"
// import { API_PATHS } from "../../utils/apiPaths";
// import Modal  from "../../components/Modal";
// import AddIncomeForm from "../../components/Income/AddIncomeForm";
// import toast from "react-hot-toast";
// //import IncomeList from "../../components/Income/IncomeList";

// const Income = () => {
//   const [incomeData,setIncomeData]=useState ([]);
//   const [loading,setLoading]=useState (false);
//   const [OpenDeleteAlert,setOpenDeleteAlert]=useState ({
//     show:false,
//     data:null,
//   });
// const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

// //Get all income detail

// const fetchIncomeDetails = async()=>{
// if(loading) return;

// setLoading(true);
// try {
//  const response = await axiosInstance.get(
//   `${API_PATHS.INCOME.GET_ALL_INCOME}`
//  );

//  if(response.data) {
//   setIncomeData(response.data);
 
//  }
//  }catch(error){
//   console.log("Something went error .Please try again.",error);
  
//  }finally{
//   setLoading(false);
//  }
// }

// //Handle add income

// const handleAddIncome = async (income) => {
//   const { source, amount, date, icon } = income;

//   // Validation Checks
//   if (!source.trim()) {
//     toast.error("Source is required.");
//     return;
//   }

//   if (!amount || isNaN(amount) || Number(amount) <= 0) {
//     toast.error("Amount should be a valid number greater than 0.");
//     return;
//   }

//   if (!date) {
//     toast.error("Date is required.");
//     return;
//   }

//   try {
//     await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
//       source,
//       amount,
//       date,
//       icon,
//     });

//     setOpenAddIncomeModal(false);
//     toast.success("Income added successfully");
//     fetchIncomeDetails();
//   } catch (error) {
//     console.log("Error adding income: ", error.response?.data?.message || error.message);
//   }
// };

// //delete income 

// const deleteIncome = async(id)=>{

// }

// //handle Download Income detail

// const handleDownloadIncomeDetails = async()=>{

// }

//   useEffect(() => {
//     fetchIncomeDetails();

//    return () => {};
//   }, [])
  

//   return (
//     <DashboardLayout activeMenu="Income">
//       <div className="my-5 mx-auto">
//         <div className="grid grid-cols-1 gap-6">
//           <div className="">
//             <IncomeOverview
//               transactions={incomeData}
//               onAddIncome={() => setOpenAddIncomeModal(true)}
//             />
//           </div>

//           {/* <IncomeList
//           transactions={incomeData}
//     onDelete={(id)=>{
//       setOpenDeleteAlert({show:true,data:id});
//     }}
//     onDownload={handleDownloadIncomeDetails}
//        />    */}
//         </div>

//         <Modal
//           isOpen={openAddIncomeModal}
//           onClose={()=>setOpenAddIncomeModal(false)}
//           title="Add Income"
// >
//         <AddIncomeForm onAddIncome={handleAddIncome}/>
//         </Modal>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Income;





import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // Get all income details
const fetchIncomeDetails = async () => {
  if (loading) return;

  setLoading(true);
  try {
    const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

    // console.log("Income API response:", response.data);

    if (response?.data?.data) {
      setIncomeData(response.data.data); 
    } else {
      setIncomeData([]);
    }
  } catch (error) {
    console.log("Something went wrong. Please try again.", error);
    toast.error("Failed to load income data");
  } finally {
    setLoading(false);
  }
};

  // // Handle add income
  // const handleAddIncome = async (income) => {
  //   const { source, amount, date, icon } = income;

  //   if (!source.trim()) {
  //     toast.error("Source is required.");
  //     return;
  //   }

  //   if (!amount || isNaN(amount) || Number(amount) <= 0) {
  //     toast.error("Amount should be a valid number greater than 0.");
  //     return;
  //   }

  //   if (!date) {
  //     toast.error("Date is required.");
  //     return;
  //   }

  //   try {
  //     await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
  //       source,
  //       amount,
  //       date,
  //       icon,
  //     });

  //     setOpenAddIncomeModal(false);
  //     toast.success("Income added successfully");
  //     fetchIncomeDetails();
  //   } catch (error) {
  //     console.log("Error adding income: ", error.response?.data?.message || error.message);
  //   }
  // };

  // delete income (still needs logic)
  const deleteIncome = async (id) => {
    // implement later
  };

  // handle download income detail (still needs logic)
  const handleDownloadIncomeDetails = async () => {
    // implement later
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          {/* <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
          /> */}
        </div>
{/* 
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal> */}
        
        {/* <Modal
        isOpen ={openDeleteAlert.show}
        onClose = {()=> setOpenDeleteAlert({show:false, data:null})}
        title="Delete Income "
        >
          <DeleteAlert
          content="Are you sure you want to delete this income detail?"
          onDelete={()=> deleteIncome(openDeleteAlert.data)}
          />
          </Modal> */}
      </div>
    </DashboardLayout>
  );
};

export default Income;
