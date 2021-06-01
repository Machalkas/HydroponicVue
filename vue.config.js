module.exports = {//Добавил это чтобы не было ошибки с sockjs-node
    devServer: {
        disableHostCheck: true,
        port: 8080,
        public: '0.0.0.0:8080'
    },
    publicPath: "/"
}