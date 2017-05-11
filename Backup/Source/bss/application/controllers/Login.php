<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

    
	public function admin_login()
	{
	    $this->load->library('session');
	    $data['title'] = "飞猪管理系统";
	    $this->load->model('admin_user_model');
	    $this->load->helper('cookie');
	    
	    if($this->input->post()){
	        $post = $this->input->post();
	        $admin = $this->admin_user_model->find_admin_user($post);
	        if($admin)
	        {
	            $this->session->set_userdata($admin);
	            //设置cookie
	            if(isset($post['record']) && $post['record']==1)
	            {
	                $time = 30*24*60*60;
	                $cookie['user_name'] = array(
	                    'name'   => 'user_name',
	                    'value'  => $post['user_name'],
	                    'expire' => $time,
	                );
	                $cookie['password'] = array(
	                    'name'   => 'password',
	                    'value'  => $post['password'],
	                    'expire' => $time,
	                );
	                $this->input->set_cookie($cookie['user_name']);
	                $this->input->set_cookie($cookie['password']);
	            }else{
	                $cookie['user_name'] = array(
	                    'name'   => 'user_name',
	                    'value'  => $post['user_name'],
	                    'expire' => '',
	                );
	                $cookie['password'] = array(
	                    'name'   => 'password',
	                    'value'  => $post['password'],
	                    'expire' => '',
	                );
	                $this->input->set_cookie($cookie['user_name']);
	                $this->input->set_cookie($cookie['password']);
	            }
	            //redirect(base_url());
	            redirect('/ad/ad_list');
	        }
	    }
	    
	    $this->load->view('login/admin_login', $data);
	}
	
	public function admin_logout()
	{
	    $this->load->library('session');
	    $this->session->sess_destroy();
	    
	    redirect(base_url('/login/admin_login'));
	}
	
	//获取验证码
	public function get_code() {
	    $this->load->library('Captcha',null,"captcha");
	    $code = $this->captcha->getCaptcha();
	    $this->session->set_userdata('reg_code', $code);
	    $this->captcha->showImg();
	}
	
	//登录验证
	public function check_login($username=0, $password=0, $code=0)
	{
	    $username = urldecode($username);
	    $this->load->model('admin_user_model');
	    $res = $this->admin_user_model->check_login($username, $password, $code);
	     
	    echo json_encode($res);
	    exit;
	}
}
