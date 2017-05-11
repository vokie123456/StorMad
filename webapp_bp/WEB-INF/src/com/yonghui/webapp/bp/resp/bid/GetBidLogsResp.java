package com.yonghui.webapp.bp.resp.bid;

import java.io.Serializable;
import java.util.List;

import com.yonghui.comp.ad.share.bean.AdLocation;
import com.yonghui.comp.bid.share.enums.BidStatus;
import com.yonghui.comp.common.share.bean.BaseShop;

public class GetBidLogsResp implements Serializable {

	private static final long serialVersionUID = 1323858258204018392L;
	
	private String blId;	//标识字段
	private int bpId;	//档期ID
	private String bpName;	//档期名称
	private long cStartDate;	//投放开始日期
	private long cEndDate;		//投放结束日期
	private long cStartTime;	//投放开始时间点
	private long cEndTime;	//投放结束时间点
	private String iId;		//行业ID
	private String iName;	//行业名称
	private List<AdLocation> alList;	//广告位列表
	private List<BaseShop> shops;	//门店列表
	private int maxMoney;	//当期档期行业最高出价
	private int money;	//竞投金额
	private long bidTime;	//竞投时间
	private BidStatus status;	//竞投状态 1：竞投中  2：竞投失败  3：竞投成功
	private int bpStatus;	//档期状态 1：竞拍中 2：竞拍结束 
	
	public String getBlId() {
		return blId;
	}
	public void setBlId(String blId) {
		this.blId = blId;
	}
	public int getBpId() {
		return bpId;
	}
	public void setBpId(int bpId) {
		this.bpId = bpId;
	}
	public String getBpName() {
		return bpName;
	}
	public void setBpName(String bpName) {
		this.bpName = bpName;
	}
	public long getCStartDate() {
		return cStartDate;
	}
	public void setCStartDate(long cStartDate) {
		this.cStartDate = cStartDate;
	}
	public long getCEndDate() {
		return cEndDate;
	}
	public void setCEndDate(long cEndDate) {
		this.cEndDate = cEndDate;
	}
	public long getCStartTime() {
		return cStartTime;
	}
	public void setCStartTime(long cStartTime) {
		this.cStartTime = cStartTime;
	}
	public long getCEndTime() {
		return cEndTime;
	}
	public void setCEndTime(long cEndTime) {
		this.cEndTime = cEndTime;
	}
	public String getIId() {
		return iId;
	}
	public void setIId(String iId) {
		this.iId = iId;
	}
	public String getIName() {
		return iName;
	}
	public void setIName(String iName) {
		this.iName = iName;
	}
	public List<AdLocation> getAlList() {
		return alList;
	}
	public void setAlList(List<AdLocation> alList) {
		this.alList = alList;
	}
	public List<BaseShop> getShops() {
		return shops;
	}
	public void setShops(List<BaseShop> shops) {
		this.shops = shops;
	}
	public int getMaxMoney() {
		return maxMoney;
	}
	public void setMaxMoney(int maxMoney) {
		this.maxMoney = maxMoney;
	}
	public int getMoney() {
		return money;
	}
	public void setMoney(int money) {
		this.money = money;
	}
	public long getBidTime() {
		return bidTime;
	}
	public void setBidTime(long bidTime) {
		this.bidTime = bidTime;
	}
	public BidStatus getStatus() {
		return status;
	}
	public void setStatus(BidStatus status) {
		this.status = status;
	}
	public int getBpStatus() {
		return bpStatus;
	}
	public void setBpStatus(int bpStatus) {
		this.bpStatus = bpStatus;
	}
	@Override
	public String toString() {
		return "GetBidLogsResp [blId=" + blId + ", bpId=" + bpId + ", bpName="
				+ bpName + ", cStartDate=" + cStartDate + ", cEndDate="
				+ cEndDate + ", cStartTime=" + cStartTime + ", cEndTime="
				+ cEndTime + ", iId=" + iId + ", iName=" + iName + ", alList="
				+ alList + ", shops=" + shops + ", maxMoney=" + maxMoney
				+ ", money=" + money + ", bidTime=" + bidTime + ", status="
				+ status + ", bpStatus=" + bpStatus + "]";
	}
}
