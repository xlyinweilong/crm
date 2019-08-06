export function isResponseOk(res) {
  if(res.code === 50008){
	  uni.redirectTo({
	  	url: '/pages/login/index'
	  })
	  return false
  }
  if(res.code != 0){
	  return false
  }
  return true
}