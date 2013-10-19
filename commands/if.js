// 依赖模块
var ifm = require('../lib/if-sync');
var path = require('path');
var fs = require('fs');


var DEF_OPT = {
    encoding: 'utf-8',
    configFile: 'demo/data/if-config.json'
};

// 导出命令
module.exports = {
    exec: function(argv) {
        var cwd = process.cwd();

        //console.log(argv);
        // 接口初始化
        if (argv.init || argv.i) {
            var root = argv.init || argv.i;
            ifm.ifInit({
                root: typeof(root) === 'string' ? root : cwd
            });
        }
        // 接口文档生成
        else if (argv.sync || argv.s) {
            var ifConfigPath = argv.s || argv.sync;
            ifConfigPath = typeof(ifConfigPath) === 'string' ? ifConfigPath : path.join(cwd, DEF_OPT.configFile);

            if (!fs.existsSync(ifConfigPath)) {
                console.error('未找到配置文件：' + ifConfigPath);
                return;
            }

            var opt = JSON.parse(fs.readFileSync(ifConfigPath, DEF_OPT.encoding));
            var dataDir = path.dirname(ifConfigPath);
            opt.dataDir = dataDir;
            opt.savePath = path.join(dataDir, opt.savePath);

            ifm.ifSync(opt);
        }
        // 接口服务器
        else if (argv.server || argv.e) {
            var root = argv.server || argv.e;
            root = typeof(root) === 'string' ? root : path.join(cwd, 'demo/data');
            var port = parseInt(argv.port || argv.p || 9999, 10);

            ifm.ifServer({
                root: root,
                port: port
            });
        }
    }
}