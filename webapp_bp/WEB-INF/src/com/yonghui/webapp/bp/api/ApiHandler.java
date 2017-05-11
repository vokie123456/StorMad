package com.yonghui.webapp.bp.api;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yonghui.comp.ader.share.bean.AderEntity;

public interface ApiHandler {
	public void handle( 
			HttpServletRequest request, HttpServletResponse response,Writer out, AderEntity ader ) throws IOException;
}
