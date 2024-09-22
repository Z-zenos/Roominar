from datetime import datetime


def format_start_end_datetime(start: datetime, end: datetime):
    if start.date() == end.date():
        return f"""
            {start.strftime("%Y/%m/%d")}
            {start.strftime("%H:%M")} 〜 {end.strftime("%H:%M")}
            """
    else:
        return f"""
            {start.strftime("%Y/%m/%d %H:%M")} 〜
            {end.strftime("%Y/%m/%d %H:%M")}
        """
