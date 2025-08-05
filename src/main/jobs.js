const schedule = require('node-schedule')
const QueueList = require('./models/queue_list')
const parse = require('./services/parse')

const run_flags = {

}

export default () => {
  const queue_job_name = 'queue_list'
  // 每3s执行一次.
  // 看看能否直接执行.
  schedule.scheduleJob(queue_job_name, '*/3 * * * * *', async() => {
    if(run_flags[queue_job_name]) {
      console.log(queue_job_name + ' is running')
      return
    }
    // 没有一种好的方式 去自动控制一下. 例如通过
    try{
      run_flags[queue_job_name] = 1
      // 开始执行业务逻辑.
      let queue_list = await QueueList.findAll({
        where: {
          status: -2
        },
        limit: 10,
        order: [
          ['id', 'ASC']
        ],
      })

      if(!queue_list) {
        console.log('no data to handle')
        run_flags[queue_job_name] = 0
        return
      }

      // 开始解析data.
      for(let i = 0; i < queue_list.length; i++) {
        const info = queue_list[i];
        const data = JSON.parse(queue_list[i].data)
        // 开始解析.
        if(info.queue_name != 'crawl_data') {
          continue
        }

        // 这里要根据平台来进行处理.
        let ret = await parse.handle(info.platform, data.url, data)

        if(!ret) {
          info.status = 0
        }else{
          info.status = 1
        }
        await info.save()
      }

      run_flags[queue_job_name] = 0;
    } catch(e) {
      console.log(e)
      run_flags[queue_job_name] = 0;
    }
  });
}