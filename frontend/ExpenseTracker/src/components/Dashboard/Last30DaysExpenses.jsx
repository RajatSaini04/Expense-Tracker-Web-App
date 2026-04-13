import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { LuArrowRight } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { prepareExpenseBarChardata } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({ data }) => {
  const [chartData,setChartData]=useState([]);

  useEffect(()=>{
    const result=prepareExpenseBarChardata(data);
    setChartData(result);
    return()=>{}
  
  },[data]);

  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Last 30 Days Expenses</h5>

      </div>
      <CustomBarChart data={chartData}/>

    </div>
  );
};

export default Last30DaysExpenses;
