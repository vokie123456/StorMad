<%@page import="com.yonghui.webapp.bss.api.money.RechargeHandler"%>
<%@page import="com.yonghui.webapp.bss.util.JsonUtil"%>
<%@page import="com.yonghui.webapp.bss.util.Exceptions"%>
<%@ page language="java" contentType="text/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/api/head.jsp" %>
<%--
==================================
===========廣告主充值===========
==================================
--%>
<%
try{
	new RechargeHandler().handle( request,response,out, admin );
}catch( Exception e ){
	e.printStackTrace();
	JsonUtil.MAPPER.writeValue( out, Exceptions.makeUnknownException( e.getMessage() ) );	
}
%>