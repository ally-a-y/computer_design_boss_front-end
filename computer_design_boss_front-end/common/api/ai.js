import request from './request.js'

// 静态资源URL处理函数
export const getStaticUrl = (url) => {
  // 如果url已经是完整的HTTP URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 否则，返回完整的URL
  const baseUrl = 'http://localhost:5000'
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

// AI求职助手API
export const aiApi = {
  // 简历分析
  askByUserJobName: (jobName) => request({
    url: '/ai/ask_by_user_job_name',
    method: 'GET',
    params: { job_name: jobName }
  }),
  
  askByUserJobText: (jobText) => request({
    url: '/ai/ask_by_user_job_text',
    method: 'POST',
    data: { job_text: jobText }
  }),
  
  // 简历评估（用户ID）
  resumeEvaluation: () => request({
    url: '/ai/resume_evaluation',
    method: 'GET'
  }),
  
  // 成功率分析
  successRateByUserJobName: (jobName) => request({
    url: '/ai/success_rate_user_job_name',
    method: 'GET',
    params: { job_name: jobName }
  }),
  
  successRateByUserJobText: (jobText) => request({
    url: '/ai/success_rate_user_job_text',
    method: 'POST',
    data: { job_text: jobText }
  }),
  
  // 大学生活规划
  universityPlanByUserJobName: (jobName, userGrade) => request({
    url: '/ai/university_plan_user_job_name',
    method: 'GET',
    params: { job_name: jobName, user_grade: userGrade }
  }),
  
  universityPlanByUserJobText: (jobText, userGrade) => request({
    url: '/ai/university_plan_user_job_text',
    method: 'POST',
    data: { job_text: jobText, user_grade: userGrade }
  }),
  
  // AI对话
  chat: (message) => request({
    url: '/ai/chat',
    method: 'POST',
    data: { message }
  })
}

// 模拟面试API 
export const interviewApi = {
  // 提交回答
  answer: (sessionId, userText, endInterview) => request({
    url: `/ai/interview/${sessionId}/answer`,
    method: 'POST',
    data: { user_text: userText, end_interview: endInterview }
  }),
  
  // 获取报告
  getReport: (sessionId) => request({
    url: `/ai/interview/${sessionId}/report`,
    method: 'GET'
  }),
  
  // 获取历史
  getHistory: (sessionId) => request({
    url: `/ai/interview/${sessionId}/history`,
    method: 'GET'
  })
}

export default { ai: aiApi, interview: interviewApi }