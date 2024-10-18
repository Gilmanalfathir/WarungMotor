import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-overlay"></div>
        <h1>Warung Motor</h1>
        <p>
          Selamat datang di WarungMotor.com, destinasi terbaik untuk jual beli motor di Indonesia. Temukan koleksi motor terbaik dari berbagai merek, baru atau bekas, dengan keamanan dan kemudahan terjamin. Mulai petualangan Anda di jalan raya dengan motor yang tepat, hanya di WarungMotor.com!
        </p>
      </div>
      <div className="login-right">
        <h2>MASUK</h2>
        <form>
          <label>USERNAME</label>
          <input type="text" placeholder="e-mail/username" />
          <label>PASSWORD</label>
          <input type="password" placeholder="password" />
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> tetap masuk
            </label>
            <a href="/">Lupa Password?</a>
          </div>
          <button type="submit">MASUK</button>
        </form>
        <p>
          Belum punya akun? <a href="/register">Daftar</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
