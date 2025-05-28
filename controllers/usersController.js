const usersService = require('../services/usersService');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


// 로그인
exports.login = async function (req, res) {
    const { user_id, password } = req.body;

  // TODO: email, password 형식적 Validation

  const signInResponse = await usersService.postSignIn(user_id, password);

  if (signInResponse.user_id == user_id) {
    return res
                .cookie("x_auth", signInResponse.jwt, {
                  maxAge: 1000 * 60 * 60 * 24 * 7, // 7일간 유지
                  httpOnly: true,
                })
                .render('users/login', { signInResponse: signInResponse, loginState : '성공'});
  }
  else {
    return res.send(`
    <script>
      if (confirm('로그인에 실패했습니다.')) {
        window.location.href = "/";
      }
    </script>
  `);
  }
};