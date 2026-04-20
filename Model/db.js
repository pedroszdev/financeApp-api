import Sequelize from 'sequelize';
import 'dotenv/config'; 
const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',   // Qual banco estamos usandos
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Permite a conexão segura com o Neon
        }
    }
});

export default sequelize;


