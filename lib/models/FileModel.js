const FileModel = (sequelize, DataTypes) => {
    const File = sequelize.define(
        "File",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            url: { type: DataTypes.TEXT, allowNull: false },
            table_name: { type: DataTypes.STRING(255), allowNull: false },
            type: {
                type: DataTypes.ENUM("online", "file_upload"),
                allowNull: false,
            },
        },
        { timestamps: true, tableName: "files" }
    );

    // File.associate = (models) => {
    //     File.belongsTo(models.User, {
    //         foreignKey: "user_id",
    //         onDelete: "CASCADE",
    //     });
    // };

    return File;
};

export default FileModel;