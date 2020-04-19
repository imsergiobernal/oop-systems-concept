import { Model, Sequelize, DataTypes, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, BelongsToCreateAssociationMixin } from 'sequelize';
import { OCS, Adapter } from '../subsystems/OCS';

const sequelize = new Sequelize('sqlite:memory:', { logging: (sql): void => console.log(sql)});
let models: { [key: string]: typeof Model & { associate(models: any): void } };

/**
 * @todo Module that groups ORM/DAOs in some way.
 */
(async function ormLoader(): Promise<void> {
  class Account extends Model {
    public readonly createdAt!: string;
    public readonly deletedAt!: string;
    public email!: string;
    public readonly id!: string;
    public password!: string;
    public readonly updatedAt!: string;
  
    public Streamer?: Streamer;
    public createStreamer!: HasOneCreateAssociationMixin<Streamer>;
    public getStreamer!: HasOneGetAssociationMixin<Streamer>;
  
    public static associate(models: any): void {
      Account.hasOne(models.Streamer);
    }
  }
  
  Account.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'account',
      freezeTableName: true,
      underscored: true,
      paranoid: true,
      sequelize,
      timestamps: true,
    }
  )
  
  class Streamer extends Model {
    public readonly createdAt!: string;
    public readonly deletedAt!: string;
    public readonly id!: string;
    public nickname!: string;
    public readonly updatedAt!: string;
  
    public Account?: Account;
    public createAccount!: BelongsToCreateAssociationMixin<Account>;
    public getAccount!: HasOneGetAssociationMixin<Account>;
  
    public static associate(models: any): void {
      Streamer.belongsTo(models.Account);
    }
  }
  
  Streamer.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
    },
    {
      tableName: 'streamer',
      freezeTableName: true,
      underscored: true,
      paranoid: true,
      sequelize,
      timestamps: true,
    }
  )
  
  models = {
    Account,
    Streamer
  }
  
  Object.values(models).forEach(model => model.associate(models));

  await sequelize.sync({ force: true })
})();


/**
 * Streamer Domain Component
 */
export class SDC {

  private ocs: OCS;

  constructor(ocs: OCS) {
    this.ocs = ocs;
  }

  createOverlay = async (id: string, uri: string, adapter: Adapter): Promise<void> => {
    this.ocs.registerOverlay(uri, id, { adapter });
  }

  signup = async (email: string, nickname: string, password: string): Promise<void> => {
    await models.Streamer.create({ nickname, Account: { email, password } }, { include: [ models.Account ] });
  }
}
