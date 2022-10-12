import {
	get,
	post,
	put,
	del,
	download,
} from './http'


//系统参数列表
export const getSysParam = p => get('api/sysParams', p)

//操作人
export const getOperator = p => get('api/operators', p)

//操作日志
export const getOperateLog = p => get('api/operateLogs', p)

//系统代码
export const getSysCode = p => get('api/sysCodes', p)

//新增系统参数
export const insertSysParam = p => post('api/sysParams', p)

// 修改系统参数
export const putSysParam = p => put('api/sysParams', p)

// 删除系统参数
export const delSysParam = p => del('api/sysParams', p)

// 导出操作日志报表
export const exportLogs = p => download('api/operateLogs/tables', p)


//新增行政区域
export const insertRegion = p => post('api/regions', p)

//获取父级区域
export const getParent = p => get('api/regions/parentRegions', p)

//新增控制阀门
export const insertValve = p => post('api/controlValves', p)

//导出企业日数据报表
export const exportCompanyDailyData = p => get('api/dailyDatas/tables', p)

//导出企业小时数据报表
export const exportCompanyHourData = p => get('api/hourDatas/tables', p)

//导出企业分钟数据报表
export const exportCompanyMinuteData = p => get('api/minuteDatas/tables', p)

//导出企业月数据报表
export const exportCompanyMonthData = p => get('api/monthDatas/tables', p)

//导出企业实时数据报表
export const exportCompanyTimeData = p => get('api/timeDatas/tables', p)


//导出企业年数据报表
export const exportCompanyYearData = p => get('api/yearDatas/tables', p)


//导出截污井日数据报表
export const exportWellDailyData = p => get('api/wellDailyDatas/tables', p)

//导出截污井小时数据报表
export const exportWellHourData = p => get('api/wellHourDatas/tables', p)


//导出截污井分钟数据报表
export const exportWellMinuteData = p => get('api/wellMinuteDatas/tables', p)


//导出截污井月数据报表
export const exportWellMonthData = p => get('api/wellMonthDatas/tables', p)


//导出截污井实时数据报表
export const exportWellTimeData = p => get('api/wellTimeDatas/tables', p)


//导出截污井年数据报表
export const exportWellYearData = p => get('api/wellYearDatas/tables', p)

//删除企业基本信息
export const delCompanyBase = p => del('api/companyBases', p)

//删除企业排口
export const delCompanyHole = p => del('api/companyHoles', p)

//删除企业许可证
export const delCompanyLicense= p => del('api/companyLicenses', p)


//删除截污井
export const delWell= p => del('api/wells', p)

//新增排口
export const insertHole= p => post('api/companyHoles', p)

//修改排口
export const editHole= p => put('api/companyHoles', p)


//获取排口监控点性质
export const  getHoleNature = p => get('api/companyHoles/Nature', p)



//新增截污井
export const insertWell= p => post('api/wells', p)

//修改截污井
export const editWell= p => put('api/wells', p)

//获取截污井监控点
export const  getWellNature = p => get('api/wellNature', p)

//获取污染物因子
export const  getPollutedFactor = p => get('api/pollutedFactorNames', p)


//根据排口ID获取污染物因子信息
export const  getPollutedFactorByID = p => get('api/companyHoles/pollutedFactors', p)


//获取外环境污染物因子
export const  pollutedFactorByWell = p => get('api/pollutedFactorsByWell', p)



