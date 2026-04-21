import { DataTypes } from 'sequelize';
import sequelize from './db.js';
const Transacao = sequelize.define('Transacao', {
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    descricao:{
        type:DataTypes.STRING,
        allowNull: false
    },
    tipo:{
        type:DataTypes.STRING,
        allowNull: false
    },
    valor:{
        type:DataTypes.DOUBLE,
        allowNull: false
    },
    categoria:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    data:{
        type:DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    }
});

export default Transacao;