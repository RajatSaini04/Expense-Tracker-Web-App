import moment from "moment";

  export const validateEmail = (email) => {
  const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// export const getInitials =(name)=>{
// if(!name) return "";

// const words = name.split(" ")
// let initials="";
// for(let i=0;i<Math.min(words.length,2);i++) {
//   initials += words[i][0];
// }
// return initials.toUpperCase();
// };


export const getInitials = (name = "") => {
  const words = name.trim().split(" ");
  let initials = "";
  for (let i = 0; i < words.length && initials.length < 2; i++) {
    if (words[i].length > 0) {
      initials += words[i][0];
    }
  }
  return initials.toUpperCase();
};


export const  addThousandsSeparator =(num)=>{
  if(num==null || isNaN(num)) return "";

  const [integerPart,fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3}))/g,",");

return fractionalPart 
?`${formattedInteger}.${fractionalPart}`
:formattedInteger;

};


export const prepareExpenseBarChardata=(data =[])=>{
  const charData =data.map((item)=>({
catrgory:item?.catrgory,
amount: item?.amount,
  }));
  return charData ;
};

export const prepareIncomeBarChartData = (data) => {
  if (!Array.isArray(data)) {
    console.warn("Expected array, received:", data);
    return [];
  }

  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};
