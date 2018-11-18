
library(tseries)

dowopen <-get.hist.quote(instrument = "^DJI", start = "2017-01-01", quote = "Open")

dowclose <-get.hist.quote(instrument = "^DJI", start = "2017-01-01", quote = "Close")


diff = (dowclose - dowopen)/dowopen

var(diff)

hdopen <-get.hist.quote(instrument = "HD", start = "2017-01-01", quote = "Open")

hdclose <-get.hist.quote(instrument = "HD", start = "2017-01-01", quote = "Close")

hddiff = (hdclose - hdopen)/hdopen

var (hddiff)

cov(hddiff, diff)

beta = cov(hddiff, diff)/ var (diff)

colnames(beta)[colnames(beta)=="Close"] <- "beta"; rownames(beta)[rownames(beta)=="Close"] <- "HD"

beta
