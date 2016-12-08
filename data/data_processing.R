library('dplyr')
daily_trips<-trip_data_2014_04%>%group_by(Origin_County, Destination_County, Start_Date)%>%summarize(trips = sum(Count))%>%arrange(Start_Date, Origin_County, Destination_County)
daily_trips_external<-filter(daily_trips, Origin_County!=Destination_County)

sub_class = c(unique(trip_data_2014_04$Subscriber_Class), 'all')

purpose <- c(unique(trip_data_2014_04$Purpose), 'all')

for (i in 1:30){
  date = paste0('2014-04-', formatC(i, width=2, flag="0"))
  daily_trips<-trip_data_2014_04%>% filter(Start_Date == date)
  for (p in purpose)  
    
    
            %>% group_by(Origin_County, Destination_County, Start_Date)
            %>% summarize(trips = sum(Count))
            %>% arrange(Start_Date, Origin_County, Destination_County)
  
  
  
}