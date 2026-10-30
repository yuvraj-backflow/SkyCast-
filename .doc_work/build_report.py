from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.style import WD_STYLE_TYPE

OUT = r"C:\Users\yuvra\Downloads\Skycast\Skycast_Project_Documentation.docx"

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Inches(8.27), Inches(11.69)
sec.left_margin = sec.right_margin = Inches(1)
sec.top_margin, sec.bottom_margin = Inches(0.9), Inches(0.8)
sec.different_first_page_header_footer = True

styles = doc.styles
normal = styles['Normal']
normal.font.name = 'Times New Roman'; normal.font.size = Pt(12)
normal._element.rPr.rFonts.set(qn('w:ascii'), 'Times New Roman')
normal._element.rPr.rFonts.set(qn('w:hAnsi'), 'Times New Roman')
normal.paragraph_format.line_spacing = 1.5
normal.paragraph_format.space_after = Pt(6)
for nm, size in [('Title', 20), ('Heading 1', 14), ('Heading 2', 13), ('Heading 3', 12)]:
    s = styles[nm]; s.font.name = 'Times New Roman'; s.font.size = Pt(size); s.font.bold = True; s.font.color.rgb = RGBColor(0,0,0)
    s._element.rPr.rFonts.set(qn('w:ascii'), 'Times New Roman'); s._element.rPr.rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    s.paragraph_format.space_before = Pt(12); s.paragraph_format.space_after = Pt(6)

def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr(); shd = OxmlElement('w:shd'); shd.set(qn('w:fill'), fill); tcPr.append(shd)
def set_cell_text(cell, text, bold=False, center=False):
    cell.text = ''
    p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.LEFT
    r = p.add_run(str(text)); r.bold = bold; r.font.name = 'Times New Roman'; r.font.size = Pt(10)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
def set_repeat_table_header(row):
    trPr = row._tr.get_or_add_trPr()
    tblHeader = OxmlElement('w:tblHeader')
    tblHeader.set(qn('w:val'), 'true')
    trPr.append(tblHeader)
def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers)); t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.style = 'Table Grid'
    for i,h in enumerate(headers): set_cell_text(t.rows[0].cells[i], h, True, True); shade(t.rows[0].cells[i], 'D9EAF7')
    set_repeat_table_header(t.rows[0])
    for row in rows:
        cells=t.add_row().cells
        for i,v in enumerate(row): set_cell_text(cells[i], v, False, i==0 or (len(str(v)) < 18))
    if widths:
        for row in t.rows:
            for i,w in enumerate(widths): row.cells[i].width = Inches(w)
    doc.add_paragraph('')
    return t
def footer(section):
    p = section.footer.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run('Page ')
    fld = OxmlElement('w:fldSimple'); fld.set(qn('w:instr'), 'PAGE'); p._p.append(fld)
def page_break(): doc.add_page_break()
def title(text):
    p=doc.add_paragraph(); p.style='Title'; p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.add_run(text)
def h(text, level=1): doc.add_heading(text, level=level)
def p(text='', center=False, boldlead=None):
    par=doc.add_paragraph(); par.alignment=WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.JUSTIFY
    if boldlead and text.startswith(boldlead):
        par.add_run(boldlead).bold=True; par.add_run(text[len(boldlead):])
    else: par.add_run(text)
    return par
def bullets(items):
    for x in items:
        q=doc.add_paragraph(style='List Bullet'); q.add_run(x)
def placeholder(text):
    q=doc.add_paragraph(); q.alignment=WD_ALIGN_PARAGRAPH.CENTER; r=q.add_run('['+text+']'); r.italic=True

# Cover
p('(A Typical Specimen of Cover Page and Title Page)', True)
doc.add_paragraph('')
title('SKYCAST WEATHER FORECAST APPLICATION')
p('A Project Report', True)
p('Submitted by', True)
placeholder('STUDENT NAME 1 (UNIVERSITY ENROLLMENT NUMBER)')
placeholder('STUDENT NAME 2 (UNIVERSITY ENROLLMENT NUMBER)')
placeholder('STUDENT NAME 3 (UNIVERSITY ENROLLMENT NUMBER)')
p('in partial fulfillment for the award of the degree of', True)
p('Bachelor of Computer Application', True)
p('At', True)
p('Department of Computer Science', True)
p('INDUS UNIVERSITY', True)
p('Academic Year 2026 - 27', True)
page_break()

# acknowledgement
title('ACKNOWLEDGEMENT')
p('We express our sincere gratitude to our project guide, faculty members, and the Department of Computer Science for their guidance and encouragement during the development of Skycast. Their support helped us understand the stages of software development, from requirement analysis and system design to implementation and testing.')
p('We also thank Indus University for providing the academic environment and resources required to complete this project. Finally, we acknowledge our families and classmates for their encouragement and constructive feedback throughout the work.')
placeholder('Replace this acknowledgement with the students own words before submission')
page_break()

# company certificate
title('CERTIFICATE OF COMPANY')
p('This page is reserved for the company certificate required by the Project I guidelines. Obtain the certificate from the organization, if the project was completed in association with a company, and insert the signed original or an approved copy here.')
placeholder('COMPANY CERTIFICATE TO BE INSERTED')
page_break()

# university certificate
title('CERTIFICATE')
p('This is to certify that the project titled “Skycast Weather Forecast Application” is the bonafide work carried out by [STUDENT NAME(S)], student(s) of Bachelor of Computer Application SEM - V during the academic year 2026 - 27, in partial fulfillment of the requirements for the award of the degree of Bachelor of Computer Application.')
doc.add_paragraph('\n\n')
table(['Internal Guide Signature', 'Head of Department Signature'], [['Name: [GUIDE NAME]\nDate: __________', 'Name: __________\nDate: __________']], [3.1,3.1])
doc.add_section(WD_SECTION.NEW_PAGE)

# contents
title('TABLE OF CONTENTS')
toc=[('1','Introduction'),('2','Organization Profile'),('3','Existing System'),('4','Problem Areas of Existing System'),('5','Need for the New System'),('6','Proposed System'),('7','System Flow Diagram'),('8','UML Diagrams'),('9','Data Dictionary'),('10','User Interface Screens'),('11','Reports'),('12','Test Plan and Test Cases'),('13','Future Enhancement'),('14','References and Bibliography')]
table(['Sr. No.','Contents','Page No.'], [[a,b,''] for a,b in toc], [0.75,5.2,0.75])
p('Page numbers may be updated in Microsoft Word after final review. The index page intentionally has no footer page number, as specified in the guideline.')
body_section = doc.add_section(WD_SECTION.NEW_PAGE)
body_section.different_first_page_header_footer = False
pg_num = OxmlElement('w:pgNumType'); pg_num.set(qn('w:start'), '1'); body_section._sectPr.append(pg_num)

# 1
h('1. Introduction')
p('Skycast is a web-based weather forecast application designed to present current weather information for a searched city in a clear dashboard. The system retrieves live weather data through a backend service and displays temperature, wind speed, humidity, and a short weather description. It also provides hourly temperature data, a location map, favourite cities, recent search history, and light or dark theme selection.')
h('1.1 Objectives',2)
bullets(['Provide current weather data for a city selected by the user.', 'Present temperature, humidity, wind speed, and weather condition in an understandable interface.', 'Display a city location on a map and show hourly temperature information.', 'Maintain favourite cities and recent searches using persistent storage.', 'Provide responsive, user-friendly feedback for empty, invalid, or failed searches.'])
h('1.2 Scope',2)
p('The current scope is city-based weather lookup. Weather data is requested from the OpenWeather service through the Spring Boot backend. Geographic coordinates are obtained through Nominatim and are used to display an OpenStreetMap layer. The system is intended for use with an internet connection and an available database server.')
page_break()

# 2
h('2. Organization Profile')
p('This academic project is developed in the Department of Computer Science, Indus University. It demonstrates a full-stack web application using a separate user interface, backend application programming interface, third-party weather service, and MySQL data storage. The work applies software engineering practices including requirement analysis, modular development, persistence, integration, and planned testing.')
page_break()

# 3/4/5
h('3. Existing System')
p('Before Skycast, a user commonly checked weather information on large weather websites or separate mobile applications. Such sources can offer extensive data but may not place current conditions, a map, hourly temperature, recent searches, and personalised favourite cities together in one focused learning project.')
h('4. Problem Areas of Existing System')
bullets(['Weather information can be distributed across different websites and applications.', 'Users may need to repeatedly enter the same city when no saved-location feature is available.', 'A large interface can make the primary information difficult to identify quickly.', 'Weather providers do not always expose data in a form that is immediately reusable by a custom frontend.'])
h('5. Need for the New System')
p('Skycast addresses these needs by placing the frequently required weather information in a single dashboard. Its backend acts as an application-specific layer between the frontend and the weather API, while MySQL supports personal data such as favourites and search history.')
page_break()

# 6
h('6. Proposed System')
p('The proposed system follows a client-server architecture. The React frontend sends requests to Spring Boot endpoints. The backend validates and processes requests, calls the OpenWeather API for live conditions and hourly forecast data, and uses MySQL through Spring Data JPA to maintain favourite cities and search history. The frontend also requests city coordinates from Nominatim and uses OpenStreetMap tiles through React Leaflet to display the city on a map.')
h('6.1 Technology Stack',2)
table(['Layer','Technology','Purpose'], [
['Frontend','React, Vite, JavaScript','Dashboard, search and component-based interface'],
['Visualisation','Recharts, React Leaflet, Lucide React','Temperature chart, map, and icons'],
['Backend','Java, Spring Boot, Spring Web MVC','REST endpoints and weather-service integration'],
['Persistence','Spring Data JPA, MySQL','Favourite-city and search-history storage'],
['External services','OpenWeather API, Nominatim, OpenStreetMap','Weather data, geocoding, and map tiles']], [1.25,2.0,3.0])
h('6.2 Functional Modules',2)
table(['Module','Description'], [
['Weather search','Searches a city and shows its current weather details.'],
['Hourly forecast','Requests hourly temperature data using latitude and longitude.'],
['Weather map','Places the selected city on an OpenStreetMap map.'],
['Favourite cities','Adds, lists, and removes saved city names.'],
['Search history','Stores successful searches and allows history deletion.'],
['Theme preference','Stores the selected light or dark theme in browser local storage.']], [1.65,4.6])
page_break()

# 7
h('7. System Flow Diagram')
p('The following flow describes a typical city-search request.')
table(['Step','Process','Output'], [
['1','User enters a city name and submits the search.','Search request starts.'],
['2','React frontend calls GET /api/{city}.','Request reaches Spring Boot.'],
['3','Weather service constructs an OpenWeather request.','Live weather response is received.'],
['4','Backend converts needed fields to a response object and saves the city in search history.','Structured weather response is returned.'],
['5','Frontend obtains coordinates using Nominatim and calls the hourly forecast endpoint.','Map coordinates and forecast data are available.'],
['6','Dashboard updates weather card, details, chart, map, favourites, and history.','User sees current information.']], [0.55,3.6,1.7])
h('7.1 Logical Architecture',2)
p('User Browser → React and Vite Frontend → Spring Boot REST API → OpenWeather API')
p('                                              ↓')
p('                                       MySQL Database')
p('The frontend independently uses Nominatim for city geocoding and OpenStreetMap tiles for map rendering.')
page_break()

# 8
h('8. UML Diagrams')
h('8.1 Use Case Description',2)
table(['Actor','Use Cases'], [['User','Search city; view current weather; view hourly temperature; view map; add favourite; remove favourite; view history; delete history; switch theme.'], ['System Administrator','Maintain deployment configuration, API key, and database connectivity.']], [1.7,4.55])
h('8.2 Component Diagram Description',2)
table(['Component','Responsibility','Key Interaction'], [
['React application','Renders dashboard and manages browser-side state.','Calls REST API and external geocoding service.'],
['Spring controllers','Expose weather, favourite, and search-history endpoints.','Route requests to services.'],
['Service layer','Fetches weather data and applies business logic.','Uses REST client and repositories.'],
['Repository layer','Persists entities using JPA.','Reads and writes MySQL records.'],
['External services','Provide weather, coordinates, and map tiles.','Respond to HTTP requests.']], [1.55,2.8,1.9])
h('8.3 Sequence Description',2)
p('User → Frontend: search city. Frontend → Weather Controller: GET /api/{city}. Weather Controller → Weather Service: getWeather(city). Weather Service → OpenWeather: current-weather request. OpenWeather → Weather Service: JSON response. Weather Service → Search History Service: save city. Weather Service → Frontend: simplified weather response. Frontend → Nominatim and hourly endpoint: obtain map and chart data. Frontend → User: update dashboard.')
page_break()

# 9
h('9. Data Dictionary')
h('9.1 Persistent Entities',2)
table(['Entity','Field','Type','Description'], [
['Favourite','id','Long','Generated primary identifier.'], ['Favourite','city','String','Saved city name; required, maximum 100 characters.'], ['Favourite','createdAt','LocalDateTime','Time at which the favourite is stored.'], ['SearchHistory','id','Long','Generated primary identifier.'], ['SearchHistory','city','String','Searched city name; required, maximum 100 characters.'], ['SearchHistory','searchAt','LocalDateTime','Time at which the city is searched.']], [1.2,1.3,1.4,2.35])
h('9.2 Weather Transfer Data',2)
table(['Field','Type','Description'], [['city','String','Name returned for the weather location.'],['temperature','double','Current temperature in metric units.'],['windspeed','double','Wind speed supplied by weather service.'],['humidity','int','Humidity percentage.'],['description','String','Short weather-condition description.'],['timestamp','long','Forecast-hour timestamp in the hourly response.']], [1.55,1.4,3.35])
page_break()

# 10
h('10. User Interface Screens')
p('Insert verified screenshots from the running Skycast application before final submission. Each figure should carry a caption and should be replaced with an actual application capture, not a design mock-up.')
for label in ['Figure 10.1 Skycast home dashboard and city search','Figure 10.2 Current weather card and weather details','Figure 10.3 Hourly temperature chart and weather map','Figure 10.4 Favourite cities and search history','Figure 10.5 Invalid city or network error message']:
    placeholder(label+' - INSERT SCREENSHOT HERE')
    doc.add_paragraph('\n')
page_break()

# 11
h('11. Reports')
p('Skycast provides information through dashboard views rather than printable management reports. The following application outputs constitute the project reports.')
table(['Report / Output','Contents','Source'], [
['Current weather','City, temperature, wind speed, humidity, condition description.','GET /api/{city}'],['Hourly temperature','Hourly temperature values for the selected coordinates.','GET /api/hourly?lat=&lon='],['Favourite cities','Saved city names and creation times.','GET /api/favourite'],['Search history','Previously searched city names and search times.','GET /api/Search']], [1.55,3.3,1.45])
page_break()

# 12
h('12. Test Plan and Test Cases')
p('The following test plan defines the expected behaviour. Record the actual result, date, tester, and pass or fail status when executing tests on the deployed application.')
table(['Test ID','Scenario','Input / Action','Expected Result'], [
['TC-01','Valid city search','Search Ahmedabad.','Current weather details are displayed and the city is added to search history.'],['TC-02','Invalid city search','Search an unknown city name.','A clear failure message is displayed; no misleading weather result is shown.'],['TC-03','Hourly forecast','Search a city with valid coordinates.','Hourly temperature data is returned and represented in the chart.'],['TC-04','Add favourite','Select the favourite button after a valid search.','City is saved and appears in the favourite list.'],['TC-05','Duplicate favourite','Add the same city again.','The existing favourite is returned without duplicate storage.'],['TC-06','Remove favourite','Delete a saved favourite.','Favourite is removed from the list and database.'],['TC-07','Delete history','Delete a city from search history.','Matching history records are removed.'],['TC-08','Theme preference','Switch between light and dark modes, then reload.','Selected theme remains available through local storage.'],['TC-09','API unavailability','Disconnect weather service or use an invalid API configuration.','Application provides an understandable error state.']], [0.65,1.3,2.05,2.3])
page_break()

# 13/14
h('13. Future Enhancement')
bullets(['Add browser geolocation to show weather for the user’s current location.', 'Add daily forecasts and weather alerts where supported by the selected API plan.', 'Add user authentication so favourites are linked to individual accounts.', 'Add units selection for Celsius, Fahrenheit, wind speed, and pressure.', 'Improve error handling using structured backend error responses.', 'Add automated unit, integration, and end-to-end tests.', 'Add accessibility testing, language selection, and offline-friendly behaviour.'])
h('14. References and Bibliography')
table(['No.','Reference'], [
['1','OpenWeather API documentation. https://openweathermap.org/api'],
['2','Spring Boot reference documentation. https://docs.spring.io/spring-boot/'],
['3','React documentation. https://react.dev/'],
['4','Vite documentation. https://vite.dev/'],
['5','OpenStreetMap. https://www.openstreetmap.org/'],
['6','Nominatim usage policy and documentation. https://nominatim.org/'],
['7','React Leaflet documentation. https://react-leaflet.js.org/'],
['8','Recharts documentation. https://recharts.org/']], [0.55,5.8])
p('This documentation is based on the Skycast source repository and should be reviewed by the project guide before binding and submission.')

# Footer is omitted on the cover and contents pages, as required by the guideline.
doc.sections[1].footer.is_linked_to_previous = False
doc.sections[1].first_page_footer.is_linked_to_previous = False
doc.sections[1].footer.paragraphs[0].clear()
doc.sections[1].first_page_footer.paragraphs[0].clear()
doc.sections[-1].footer.is_linked_to_previous = False
footer(doc.sections[0])
footer(doc.sections[-1])

# Metadata
doc.core_properties.title = 'Skycast Weather Forecast Application Project Documentation'
doc.core_properties.subject = 'BCA Project I Documentation'
doc.core_properties.author = 'Skycast Project Team'
doc.save(OUT)
print(OUT)
