<%--
-------------------------------------------------------------------------- 
-- 定义全局的变量 cookieBox bp_sid 
-- 如果未登录用户或没权限，在这里就返回错误了
--------------------------------------------------------------------------
--%>
<%@page import="com.yonghui.comp.ader.share.bean.AderEntity"%>
<%@page import="cn770880.jutil.data.RespWrapper"%>
<%@page import="com.yonghui.comp.ader.share.AderClient"%>
<%@page import="com.yonghui.webapp.bp.util.Exceptions"%>
<%@page import="com.yonghui.webapp.bp.util.JsonUtil"%>
<%@page import="com.feizhu.webutil.net.CookieBox"%>
<%@page import="cn770880.jutil.string.StringUtil"%>
<%@page import="cn770880.jutil.net.NetUtil"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Map"%>
<%@page import="cn770880.jutil.j4log.Logger"%>
<%
	Logger log = Logger.getLogger("webapp_bp_monitor");
	request.setCharacterEncoding("UTF-8");
	CookieBox cookieBox = new CookieBox(request, response);
	if (cookieBox.getCookie("bp_sid") == null) {
		JsonUtil.MAPPER.writeValue(out,
				Exceptions.makeNotLoginException());
		return;
	}
	String bp_sid = cookieBox.getCookie("bp_sid").getValue();
	AderEntity ader = null;
	if (StringUtil.isNotEmpty(bp_sid))
		ader = AderClient.getAderService().getAderBySid(bp_sid).getObj();
	if (ader == null) {
		JsonUtil.MAPPER.writeValue(out,
				Exceptions.makeNotLoginException());
		return;
	}
	if (ader.getStatus() == 3) {
		cookieBox.setCookie("bp_sid", "", ".stormad.cn", 0, "/");
		JsonUtil.MAPPER.writeValue(out, RespWrapper.makeResp(1001, "抱歉，该账号已被冻结！", ""));
		return;
	}
	String uri = request.getRequestURI();

	String _logoInfoMsg = "";
	Map<String, String[]> requestParams = request.getParameterMap();
	for (Iterator<String> iter = requestParams.keySet().iterator(); iter
			.hasNext();) {
		try {
			String name = iter.next();
			String[] values = requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr
						+ values[i] : valueStr + values[i] + ",";
			}
			_logoInfoMsg += name + "=" + valueStr + "&";
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	log.info("monitor operator[" + ader.getAccountName() + "] api[" + uri
			+ "] params[" + _logoInfoMsg + "]");
%>