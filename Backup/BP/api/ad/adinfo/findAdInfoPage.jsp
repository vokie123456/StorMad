<%@page import="com.yonghui.webapp.bp.api.ad.adinfo.FindAdInfoPage"%>
<%@page import="com.yonghui.webapp.bp.util.JsonUtil"%>
<%@page import="com.yonghui.webapp.bp.util.Exceptions"%>
<%@ page language="java" contentType="text/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/api/head.jsp" %>
<%--
==================================
===========分页查询广告信息===========
==================================
--%>
<%
try{
	new FindAdInfoPage().handle( request,response,out,ader );
}catch( Exception e ){
	e.printStackTrace();
	JsonUtil.MAPPER.writeValue( out, Exceptions.makeUnknownException( e.getMessage() ) );	
}
%>