<%@page import="com.yonghui.webapp.bss.api.ad.adlocation.GetAllAdLocation"%>
<%@page import="com.yonghui.webapp.bss.util.JsonUtil"%>
<%@page import="com.yonghui.webapp.bss.util.Exceptions"%>
<%@ page language="java" contentType="text/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/api/head.jsp" %>
<%--
==================================
===========获取所有广告位置信息===========
==================================
--%>
<%
try{
	new GetAllAdLocation().handle( request,response,out,admin );
}catch( Exception e ){
	e.printStackTrace();
	JsonUtil.MAPPER.writeValue( out, Exceptions.makeUnknownException( e.getMessage() ) );	
}
%>