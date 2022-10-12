import {
	get,
	post,
	download,
	del,
	put
} from './http'

// 登录
export const apiLogin = p => post('api/login', p)

// 获取编辑弹框行政区数据源
export const addDegoins = p => get('api/regionNames', p)

// 企业下拉列表
export const getCompanyList = p => get('api/companyNames', p)

// 行业类别列表
export const getIndustryType = p => get('api/industryTypeNames', p)

// 排口列表
export const getHoleNames = p => get('api/holeNames', p)

// 污染物等级列表
export const getPollutedLevel = p => get('api/pollutedLevelNames', p)

// 获取用户列表
export const getUsers = p => get('api/users', p)

// 新建用户
export const insertUsers = p => post('api/users', p)

// 修改用户
export const putUsers = p => put('api/users', p)

// 删除用户
export const delUsers = p => del('api/users', p)

// 导出用户报表
export const exportUsers = p => download('api/users/tables', p)

// 企业数据实时报表
export const timeDatas = p => get('api/timeDatas', p)

// 企业数据分钟报表
export const minuteDatas = p => get('api/minuteDatas', p)

// 企业数据小时报表
export const hourDatas = p => get('api/hourDatas', p)

// 企业数据日报表
export const dailyDatas = p => get('api/dailyDatas', p)

// 企业数据月报表
export const monthDatas = p => get('api/monthDatas', p)

// 企业数据年报表
export const yearDatas = p => get('api/yearDatas', p)

// 截污井名称列表
export const wellNames = p => get('api/wellNames', p)

// 截污井监控点名称列表
export const wellMonitorPoint = p => get('api/wellMonitorPointNames', p)

// 截污井监实时数据报表
export const wellTimeDatas = p => get('api/wellTimeDatas', p)

// 截污井监分钟数据报表
export const wellMinuteDatas = p => get('api/wellMinuteDatas', p)

// 截污井监小时数据报表
export const wellHourDatas = p => get('api/wellHourDatas', p)

// 截污井监日数据报表
export const wellDailyDatas = p => get('api/wellDailyDatas', p)

// 截污井监月数据报表
export const wellMonthDatas = p => get('api/wellMonthDatas', p)

// 截污井监年数据报表
export const wellYearDatas = p => get('api/wellYearDatas', p)

// 异常故障记录列表
export const abnormalList = p => get('api/unusualFaultRecords', p)

// 门禁状态记录列表
export const accessStatus = p => get('api/accessStatusRecords', p)

// 市电状态记录列表
export const cityElectricStatus = p => get('api/cityElectricStatusRecords', p)

// 园区报警预警信息列表
export const parkAlarms = p => get('api/parkAlarms', p)

// 企业报警预警信息列表
export const companyAlarms = p => get('api/companyAlarms', p)

// 企业联系人列表
export const contactPersons = p => get('api/contactPersons', p)

// 园区联系人列表
export const parkContact = p => get('api/parkContactPersons', p)

// 短信记录列表
export const messageRecords = p => get('api/messageRecords', p)

// 控制阀门列表
export const controlValves = p => get('api/controlValves', p)

// 远程反控采样信息列表
export const remoteSamples = p => get('api/remoteSamples', p)

// 门禁控制列表
export const accessControls = p => get('api/accessControls', p)

// 降雨指令控制列表
export const rainOrderControls = p => get('api/rainOrderControls', p)

// 污染源平衡关系列表
export const companyConfigBalanceRelations = p => get('api/companyConfigBalanceRelations', p)

// 园区平衡关系列表
export const parkConfigBalanceRelations = p => get('api/parkConfigBalanceRelations', p)

// 企业基本信息列表
export const companyBases = p => get('api/companyBases', p)

// 企业排口信息列表
export const companyHoles = p => get('api/companyHoles', p)

// 企业许可证信息列表
export const companyLicenses = p => get('api/companyLicenses', p)

// 截污井信息列表
export const wells = p => get('api/wells', p)

// 截污井监控点信息列表
export const wellMonitorPoints = p => get('api/wellMonitorPoints', p)

// 区域列表
export const getRegions = p => get('api/regions', p)

// 注册类型编码列表
export const getRegisterTypes = p => get('api/registerTypes', p)

// 单位类型编码列表
export const getCompanyTypes = p => get('api/companyTypes', p)

// 企业规模编码列表
export const getCompanyScopes = p => get('api/companyScopes', p)

// 单位隶属关系编码列表
export const getCompanyRelations = p => get('api/companyRelations', p)

// 行业分类编码列表
export const getIndustryTypes = p => get('api/industryTypes', p)

// 监控点性质编码列表
export const getMonPointNat = p => get('api/monitorPointNatures', p)

// 污染物类别编码列表
export const getPollutedTypes = p => get('api/pollutedTypes', p)

// 污染物因子编码列表
export const getPollutantFactors = p => get('api/pollutantFactors', p)

// 计量单位编码列表
export const getMeasUnits = p => get('api/measurementUnits', p)

// 获取角色资源列表
export const getRoles = p => get('api/user/roles', p)

// 获取角色列表
export const getRolesList = p => get('api/roles', p)

// 新增角色
export const addRole = p => post('api/roles', p)

// 修改角色
export const putRole = p => put('api/roles', p)

// 获取资源列表
export const getResources = p => get('api/resources', p)

// 新增资源
export const addResources = p => post('api/resources', p)

// 修改资源
export const putResources = p => put('api/resources', p)

// 删除资源
export const delResources = p => del('api/resources', p)

// 获取角色资源
export const getRoleResources = p => get('api/roleResources', p)

// 修改密码
export const password = p => put('api/users/newPasswords', p)

// 分配资源
export const putRoleResources = p => put('api/roleResources', p)

// 污染物类别列表
export const getFactor = p => get('api/factorTypeNames', p)

// 远程采样添加
export const addRemoteSamples = p => post('api/remoteSamples', p)

// 门禁控制添加
export const addaCcessControls = p => post('api/accessControls', p)

// 降雨类别列表
export const getRainTypes = p => get('api/rainTypes', p)

// 降雨指令添加
export const addRainOrderControls = p => post('api/rainOrderControls', p)

// 企业实时数据图表
export const realTimeChart = p => get('api/timeDatas/picture', p)

// 企业分钟数据图表
export const minuteChart = p => get('api/minuteDatas/picture', p)

// 企业小时数据图表
export const hourChart = p => get('api/hourDatas/picture', p)

// 企业日数据图表
export const dailyChart = p => get('api/dailyDatas/picture', p)

// 企业月数据图表
export const monthChart = p => get('api/monthDatas/picture', p)

// 企业年数据图表
export const yearChart = p => get('api/yearDatas/picture', p)

// 污染物因子列表
export const pollutedFactor = p => get('api/pollutedFactorNames', p)

// 截污井实时数据图表
export const wellTimeChart = p => get('api/wellTimeDatas/picture', p)

// 截污井分钟数据图表
export const wellMinuteChart = p => get('api/wellMinuteDatas/picture', p)

// 截污井小时数据图表
export const wellHourChart = p => get('api/wellHourDatas/picture', p)

// 截污井日数据图表
export const wellDailyChart = p => get('api/wellDailyDatas/picture', p)

// 截污井月数据图表
export const wellMonthChart = p => get('api/wellMonthDatas/picture', p)

// 截污井年数据图表
export const wellYearChart = p => get('api/wellYearDatas/picture', p)

// 新增污染源平衡配置
export const addCompanyConfig = p => post('api/companyConfigBalanceRelations', p)

// 删除污染源平衡配置
export const delCompanyConfig = p => del('api/companyConfigBalanceRelations', p)

// 新增园区平衡配置
export const addparkConfig = p => post('api/parkConfigBalanceRelations', p)

// 删除园区平衡配置
export const delparkConfig = p => del('api/parkConfigBalanceRelations', p)

// 获取注册类型
export const getRegisterType = p => get('api/registerTypeNames', p)

// 获取单位类别
export const getCompanyType = p => get('api/companyTypeNames', p)

// 获取单位隶属关系
export const getCompanyRelation = p => get('api/companyRelationNames', p)

// 获取企业规模
export const getCompanyScope = p => get('api/companyScopeNames', p)

// 新增企业信息
export const addCompanyBases = p => post('api/companyBases', p)

// 修改企业信息
export const putCompanyBases = p => put('api/companyBases', p)

// 近六月园区企业水量统计
export const parkHalfYear = p => get('api/ParkHome/parkHalfYear', p)

// 企业污水总排放排行
export const sewageTotal = p => get('api/ParkHome/sewageTotal', p)

// 污水处理厂本年总进/总出
export const sewageFactory = p => get('api/ParkHome/sewageFactory/total', p)

// 园区企业进/出水占比
export const totalPercent = p => get('api/ParkHome/totalPercent', p)

// 企业平衡关系
export const companyTotal = p => get('api/ParkHome/companyTotal', p)

// 本年外环境水质
export const factorTotal = p => get('api/ParkHome/factorTotal', p)

// 当前设备工作状态
export const deviceStatus = p => get('api/ParkHome/deviceStatus', p)

// 获取园区中企业情况
export const getParkData = p => get('api/ParkHome/parkWaterBalance', p)

// 获取企业或者截污井详情
export const getSignDetial = p => get('api/ParkHome/detial', p)

// 报警数及处理数统计
export const getWarning = p => get('api/ParkHome/alarm', p)

// 各进出水占比
export const waterQuality = p => get('api/ParkHome/TypeTotalPercent', p)

// 获取外环境污染物因子
export const pollutedFactorsByWell = p => get('api/pollutedFactorsByWell', p)

// 获取企业水环境数据
export const waterBalance = p => get('api/CompanyHome/waterBalance', p)

// 获取企业进水量
export const waterIncome = p => get('api/CompanyHome/income', p)

// 获取企业出水量
export const waterExport = p => get('api/CompanyHome/export', p)

// 获取企业进半年的进水量和出水量
export const halfYearTotal = p => get('api/CompanyHome/halfYearTotal', p)

// 近半年企业污水雨水出口情况
export const exportTotal = p => get('api/CompanyHome/halfYear/exportTotal', p)

// 获取企业报警记录​
export const alarms = p => get('api/CompanyHome/alarms', p)

// 获取企业污水排口点位​
export const holePosition = p => get('api/SewageMonitor/holePosition', p)

// 获取企业雨水排口点位
export const rainHolePosition = p => get('api/RainMonitor/rainHolePosition', p)

// 获取水平衡各排口点位
export const waterHolePosition = p => get('api/WaterBalance/waterHolePosition', p)

// 获取园区概况(污水)
export const buildingNumber = p => get('api/SewageMonitor/buildingNumber', p)

// 污水处理厂进出水统计
export const waterNumber = p => get('api/SewageMonitor/WaterNumber', p)

// 获取当月排水量前10名
export const monthWaterQuantity = p => get('api/SewageMonitor/monthWaterQuantity', p)

// 获取当月超标次数统计前10名
export const monthOver = p => get('api/SewageMonitor/MonthOver', p)

// 当月排水次数统计
export const monthExportWater = p => get('api/SewageMonitor/monthExportWater', p)

// 获取监测设备数量
export const deviceNumber = p => get('api/SewageMonitor/deviceNumber', p)

// 获取当月超标处置情况(污水)
export const monthAlarmOver = p => get('api/SewageMonitor/monthAlarmOver', p)

// 获取园区概况(雨水)
export const rainCompany = p => get('api/RainMonitor/rainCompany', p)

// 获取当月超标次数前十名
export const overTopTen = p => get('api/RainMonitor/overTopTen', p)

// 获取当月初期雨水收集情况
export const rainWaterQuantity = p => get('api/RainMonitor/RainWaterQuantity', p)

// 当月超标处置情况(雨水)
export const monthAlarm = p => get('api/RainMonitor/monthAlarm', p)

// 获取当月超标情况统计
export const overStatistics = p => get('api/RainMonitor/overStatistics', p)

// 获取雨水监控的运行状态
export const runStatus = p => get('api/RainMonitor/runStatus', p)

// 获取园区总体平衡情况
export const balanceResult = p => get('api/WaterBalance/balanceResult', p)

// 获取污水处理厂平衡关系
export const factoryBalanceResult = p => get('api/WaterBalance/factoryBalanceResult', p)

// 获取企业水平衡情况
export const companyBalance = p => get('api/WaterBalance/companyBalance', p)

// 获取上月企业平衡报表
export const balanceReport = p => get('api/WaterBalance/balanceReport', p)

// 获取平衡报表中企业
export const lastMonthCompany = p => get('api/WaterBalance/LastMonthCompany', p)

// 获取地表水定位
export const surfacePosition = p => get('api/SurfaceWater/surfacePosition', p)

// 获取园区概况
export const parkPoint = p => get('api/SurfaceWater/parkPoint', p)

// 获取运行情况
export const runStatus2 = p => get('/api/SurfaceWater/runStatus', p)

// 获取区内地表水超标溯源
export const insideOver = p => get('api/SurfaceWater/insideOver', p)

// 获取区外地表水超标溯源
export const outsideOver = p => get('api/SurfaceWater/outsideOver', p)

// 获取视频监控的园区概况
export const videoNumber = p => get('api/VideoMonitor/videoNumber', p)

// 获取视频处理终端运行情况
export const videoStatus = p => get('api/VideoMonitor/videoStatus', p)

// 获取视频处理终端运行情况
export const videoMonthOver = p => get('api/VideoMonitor/videoMonthOver', p)

// 获取当月超标图像(数据叠加)
export const videoOverlay = p => get('api/VideoMonitor/videoOverlay', p)

// 获取首页点位
export const homePosition = p => get('api/Home/homePosition', p)

// 园区概况
export const parkTotal = p => get('api/Home/parkTotal', p)

// 园区获取当月超标情况
export const monthCompanyOver = p => get('api/Home/monthCompanyOver', p)

// 获取当月企业超标报警情况
export const monthAlarmOver2 = p => get('api/Home/monthAlarmOver', p)

// 新增企业许可证信息
export const addCompanyLicenses = p => post('api/companyLicenses', p)

// 获取视频监控点位
export const videoPosition = p => get('api/VideoMonitor/videoPosition', p)

// 获取企业平衡详情
export const balanceDetail = p => get('api/WaterBalance/balanceDetail', p)

// 删除企业许可证信息
export const delDalanceDetail = p => del('api/companyLicenses', p)


//修改企业许可证信息
export const updateLicenses = p => put('api/companyLicenses', p)

//获取许可证详情
export const getBalanceDetailInfo = p => get('api/companyLicenses/LicenseDetail', p)

// 删除企业许可证污染物记录
export const delLicensePollutants = p => del('api/companyLicenses/licensePollutants', p)

// 修改企业许可证污染物信息
export const putLicensePollutants = p => put('api/companyLicenses/licensePollutants', p)

//新增企业许可证污染物信息
export const AddLicensePollutants = p => post('api/companyLicenses/licensePollutants', p)

// 获取站点详情
export const pointDetail = p => get('api/SurfaceWater/pointDetail', p)

// 获取企业实时监控数据
export const companyMonitor = p => get('api/CompanyMonitor', p)

// 获取截污井实时监控数据
export const wellMonitor = p => get('api/WellMonitor', p)

// 获取市电状态监控数据
export const electricStatusMonitor = p => get('api/cityElectricStatusRecords', p)

// 根据异常排口ID获取实时数据
export const holeData = p => get('api/SurfaceWater/holeData', p)

// 根据企业排口获取实时监控数据
export const monitorTimeData = p => get('api/SewageMonitor/monitorTimeData', p)

// 根据企业排口获取实时历史监控数据
export const monitorOldData = p => get('api/SewageMonitor/monitorOldData', p)

// 根据企业排口获取分钟监控数据
export const monitorMinuteData = p => get('api/SewageMonitor/monitorMinuteData', p)

// 根据企业排口获取小时监控数据
export const monitorHourData = p => get('api/SewageMonitor/monitorHourData', p)

// 根据企业排口获取日监控数据
export const monitorDayData = p => get('api/SewageMonitor/monitorDayData', p)

// 根据企业排口获取月监控数据
export const monitorMonthData = p => get('api/SewageMonitor/monitorMonthData', p)

// 根据企业排口获取年监控数据
export const monitorYearData = p => get('api/SewageMonitor/monitorYearData', p)

// 根据因子ID和区域ID获取污水因子监测企业
export const monitorStaus = p => get('api/SewageMonitor/monitorStaus', p)

// 获取雨水排口的设备监测数量
export const rainDeviceNumber = p => get('api/RainMonitor/deviceNumber', p)

// 根据因子ID和区域ID获取污水因子监测企业
export const rainMonitorStatus = p => get('api/RainMonitor/monitorStatus', p)

// 获取上月产业名称
export const industryName = p => get('api/WaterBalance/industryName', p)

// 获取上月产业平衡报表
export const industryReport = p => get('api/WaterBalance/industryReport', p)

// 获取运行状态的企业列表
export const runCompany = p => get('api/RainMonitor/runCompany', p)

// 获取近3月私自打开阀门报警情况统计
export const openNumber = p => get('api/RainMonitor/openNumber', p)

// 获取私自打开阀门列表
export const openList = p => get('api/RainMonitor/openList', p)

// 获取门禁状态实时监控数据
export const AccessStatusMonitor = p => get('api/AccessStatusMonitor', p)

// 获取市电状态监控数据
export const ElectricStatusMonitor = p => get('api/ElectricStatusMonitor', p)

// 获取异常故障监控数据
export const FaultMonitor = p => get('api/FaultMonitor', p)

// 根据排口获取阀门名称
export const ValveName = p => get('api/controlValves/ValveName', p)

// 获取排口性质
export const natureType = p => get('api/companyHoles/natureType', p)

// 获取一级资源
export const UpResource = p => get('api/resources/UpResource', p)

// 根据上级资源获取下级资源
export const DownResource = p => get('api/resources/DownResource', p)

// 获取资源详情
export const resourcesDetail = p => get('api/resources/detail', p)

// 导出园区预警报警记录报表
export const parkAlarmsTables = p => download('api/parkAlarms/tables', p)

// 导出企业预警报警记录报表
export const companyAlarmsTables = p => download('api/companyAlarms/tables', p)

// 导出短信记录报表
export const messageRecordsTables = p => download('api/messageRecords/tables', p)

// 新增企业联系人
export const addContactPersons = p => post('api/contactPersons', p)

// 新增企业联系人
export const addParkContactPersons = p => post('api/parkContactPersons', p)

// 导出异常故障记录报表
export const unusualFaultRecordsTables = p => download('api/unusualFaultRecords/tables', p)

// 导出门禁状态记录报表
export const accessStatusRecordsTables = p => download('api/accessStatusRecords/tables', p)

// 导出市电状态记录报表
export const cityElectricStatusRecordsTables = p => download('api/cityElectricStatusRecords/tables', p)

// 获取排口联网在线概况信息
export const getHoleInfo = () => get('/api/Home/getCount')

// 获取首页点位企业信息
export const getCompanyMonitorInfo = p =>get('/api/CompanyMonitor/getOne',p)

// 获取首页报警信息
export const getBaojingInfo = p=>get('/api/companyAlarms/getBaojing',p)

// 获取首页预警信息
export const getYujingInfo = p=>get('/api/companyAlarms/getYujing',p)

// 路由更新
export const newRoute = p => get('api/newRoute', p)