<%@page import="com.yonghui.webapp.bss.api.Upload"%>
<%@page import="com.yonghui.webapp.bss.util.JsonUtil"%>
<%@page import="com.yonghui.webapp.bss.util.Exceptions"%>
<%@ page language="java" contentType="text/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
==================================
===========广告主申请资料上传===========
==================================
--%>
<%
try{
	request.setAttribute("fileType", 1);
	new Upload().handle( request,response,out, null );
}catch( Exception e ){
	e.printStackTrace();
	JsonUtil.MAPPER.writeValue( out, Exceptions.makeUnknownException( e.getMessage() ) );	
}
%>