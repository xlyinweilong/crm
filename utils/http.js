function isResponseOk(res) {
  if(res.data.code === 50008){
	  uni.redirectTo({
	  	url: '@pages/login/index'
	  })
	  return false
  }
  if(res.data.code != 0){
	  return false
  }
  return true
}