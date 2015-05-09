package za.co.curvedradius.evolution;

import za.co.curvedradius.models.Country;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 5:07 PM
 * To change this template use File | Settings | File Templates.
 */
public class ImportCountries {
    public static List<Country> exec (){
        List<Country> countries = new ArrayList<Country>();
        //File file = new File("C:\\dev\\play\\DMA\\docs\\iso3166.txt");
        //File file = new File("/opt/iso3166.txt");
        File file = new File("C:\\Dev\\workspace\\DMA_V2\\docs\\iso3166.txt");
        if (file.exists()){
            try{
            	FileInputStream is = new FileInputStream(file);	
            	BufferedReader br = new BufferedReader(new InputStreamReader(is));
                int length = 239;
                while (length!=0){
                	String line = br.readLine();
                	String code1 = line.substring(0,2);
  ///                  String code2 = line.substring(3,6);
//
//                    String code3 = line.substring(7,10);

                    String name = line.substring(11,line.length());

                    Country country = new Country();
                    country.setCode(code1);
                    country.setName(name);

                    System.out.println(country);
                    countries.add(country);
                    length--;
                }
                is.close();
            }catch (Exception e){
                e.printStackTrace();
            }

        }else{
            System.out.println("Fail to load Iso File");
        }
        return countries;
    }
}
