package za.co.curvedradius.evolution;

import org.hibernate.cfg.Configuration;
import org.hibernate.tool.hbm2ddl.SchemaUpdate;

import java.util.Properties;

import za.co.curvedradius.models.*;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 2:30 PM
 * To change this template use File | Settings | File Templates.
 */
public class ExportSchema {
    public static void export(boolean doUpdate){
        Configuration conf = new Configuration();
        //add persistent classes into a configurator
        conf.addAnnotatedClass(Contact.class);
        conf.addAnnotatedClass(Country.class);
        conf.addAnnotatedClass(Address.class);
        conf.addAnnotatedClass(Identity.class);
        conf.addAnnotatedClass(Person.class);
        conf.addAnnotatedClass(Branch.class);
        conf.addAnnotatedClass(Right.class);
        conf.addAnnotatedClass(Role.class);
        conf.addAnnotatedClass(Variable.class);
        conf.addAnnotatedClass(User.class);
        
        //hibernate props #
        Properties h2Props = new Properties();
        h2Props.put("hibernate.hbm2ddl.auto","update");
        h2Props.put("hibernate.show_sql","true");
        h2Props.put("hibernate.dialect","org.hibernate.dialect.MySQLDialect");
        h2Props.put("hibernate.connection.driver_class","com.mysql.jdbc.Driver");
        h2Props.put("hibernate.connection.url","jdbc:mysql://localhost:3306/lifecircle_dev?zeroDateTimeBehavior=convertToNull");
        h2Props.put("hibernate.connection.username","root");
        h2Props.put("hibernate.connection.password","passwd");
        h2Props.put("hibernate.connection.pool_size","1");

        conf.setProperties(h2Props);

        SchemaUpdate update = new SchemaUpdate(conf);
        update.setHaltOnError(true);
        update.execute(true,doUpdate);
    }
}
