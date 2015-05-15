/**
 * 
 */
package za.co.curvedradius.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;


/**
 * @author Veli Khumalo
 *
 */
public class DateUtil {
	
	public static final String YYYY_MM_DD = "yyyy-MM-dd";
	public static final String YYYY_MM_DD_HHMM = "yyyy-MM-dd HH:mm";
	
	public static Date adjustWithMonths (Date date,int months){
		Calendar calender = Calendar.getInstance();
		calender.setTime(date);
		int year = calender.get(Calendar.YEAR);
		int month = calender.get(Calendar.MONTH);
		int monthRemaining = 12 - month;
		if (monthRemaining>=months){
			calender.set(Calendar.MONTH,month+months);
		}else{
			int monthToAdd = months-monthRemaining;
			calender.set(Calendar.YEAR, year+1);
			calender.set(Calendar.MONTH,monthToAdd);
		}
		return calender.getTime();
	}
	
	public static Date dateMinusMonths(Date date,int months){
		Calendar calender = Calendar.getInstance();
		calender.setTime(date);
		int month = calender.get(Calendar.MONTH);
		calender.set(Calendar.MONTH,month-months);
		
		return calender.getTime();
	}
	
	public static Date parseDate (String date,String format) throws Exception{
		System.out.println("Parse this date :"+date);
		if (date==null || date.isEmpty())
			return null;
		DateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.parse(date);
	}
	
	public static String format (Date date,String pattern){
		if(date==null)
			return "";
		
		DateFormat dateFormat = new SimpleDateFormat(pattern);
		return dateFormat.format(date);
	}
	
	public static int getDay(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.DAY_OF_MONTH);
	}
	
	public static int getYear(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.YEAR);
	}
	
	public static int month(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.MONTH);
	}
	
	public static String getMonth(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.ENGLISH);
	}
	
	public static int differanceInDays(Date fromDate,Date toDate){
		long milisecondsDiff = toDate.getTime()-fromDate.getTime();
		int daysDiff = (int)TimeUnit.MILLISECONDS.toDays(milisecondsDiff);
		return daysDiff;
	}
	
	public static void main(String [] args){
		Date today = new Date();
		
		Date afterSomeMonths = adjustWithMonths(today, 2);
		
		System.out.println("Days from today in two months "+DateUtil.differanceInDays(today, afterSomeMonths)+" days");
		
	}
	
	
}
